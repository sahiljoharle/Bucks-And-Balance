import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

const { width, height } = Dimensions.get('window');

// Background Texture Component
const BackgroundTexture = () => {
  return (
    <View style={styles.backgroundOverlay}>
      {/* Dramatic depth gradients */}
      <View style={styles.dramaticGradient1} />
      <View style={styles.dramaticGradient2} />
      <View style={styles.dramaticGradient3} />
      
      {/* Grain texture overlay */}
      <View style={styles.grainTexture} />
      
      {/* Subtle noise pattern */}
      <View style={styles.noisePattern} />
    </View>
  );
};

export default function LoginScreen() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Animation values
  const logoScale = useSharedValue(1);
  const logoRotationX = useSharedValue(0);
  const logoRotationY = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoSlideY = useSharedValue(-50);
  const titleOpacity = useSharedValue(0);
  const titleSlideY = useSharedValue(-30);
  const formOpacity = useSharedValue(0);
  const formSlideY = useSharedValue(30);
  const animationProgress = useSharedValue(0);
  const keyboardOffset = useSharedValue(0);

  useEffect(() => {
    // Keyboard event listeners
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardVisible(true);
        keyboardOffset.value = withSpring(-100); // Reduced from 120 to keep logo visible
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        keyboardOffset.value = withSpring(0); // Move content back
      }
    );

    // Initial animations on mount
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoSlideY.value = withSpring(0, { damping: 15, stiffness: 100 });
    
    // Start continuous Y-axis rotation for logo only
    logoRotationY.value = withRepeat(
      withTiming(360, { duration: 4000 }),
      -1, // infinite
      false // don't reverse
    );
    
    // Reset rotation to ensure it starts fresh
    logoRotationY.value = 0;
    logoRotationY.value = withRepeat(
      withTiming(360, { duration: 4000 }),
      -1,
      false
    );
    
    // Separate animation for title
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    titleSlideY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
    
    formOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    formSlideY.value = withDelay(400, withSpring(0, { damping: 15, stiffness: 100 }));

    return () => {
      keyboardWillShow?.remove();
      keyboardWillHide?.remove();
    };
  }, []);

  const navigateToHome = () => {
    router.replace('/home');
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (isAnimating) return;
    
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // For signup mode, check if name is provided
    if (!isLogin && !name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    
    setIsAnimating(true);
    
    try {
      // Choose endpoint based on login/register mode
      const endpoint = isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER;
      const url = `${API_BASE_URL}${endpoint}`;
      
      // Prepare request body
      const requestBody = isLogin 
        ? {
            email: email.trim(),
            password: password
          }
        : {
            name: name.trim(),
            email: email.trim(),
            password: password
          };

      console.log('Making API request to:', url);
      console.log('Request body:', { ...requestBody, password: '***' }); // Log without showing password

      // Make API call
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('API response:', data);

      if (response.ok) {
        // Success - start the success animation sequence
        Alert.alert(
          'Success', 
          isLogin ? 'Login successful!' : 'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Start the logo animation sequence
                animationProgress.value = withTiming(1, { duration: 1200 });
                
                // Logo rotation on X axis and scale animation
                logoRotationX.value = withSpring(360, { 
                  damping: 15,
                  stiffness: 100 
                });
                
                logoScale.value = withTiming(8, { 
                  duration: 1200 
                }, () => {
                  // Navigate after animation completes
                  runOnJS(navigateToHome)();
                });
                
                // Fade out form elements and title text
                formOpacity.value = withTiming(0, { duration: 800 });
                titleOpacity.value = withTiming(0, { duration: 600 });
              }
            }
          ]
        );
      } else {
        // Error response from server
        const errorMessage = data.message || data.error || 'Something went wrong. Please try again.';
        Alert.alert('Error', errorMessage);
        setIsAnimating(false);
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert(
        'Network Error', 
        'Unable to connect to server. Please check your internet connection and try again.'
      );
      setIsAnimating(false);
    }
  };

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => {
    const rotateX = `${logoRotationX.value}deg`;
    const rotateY = `${logoRotationY.value}deg`;
    
    return {
      opacity: logoOpacity.value,
      transform: [
        { translateY: logoSlideY.value },
        { perspective: 1000 },
        { rotateY },
        { rotateX },
        { scale: logoScale.value },
      ],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [
        { translateY: titleSlideY.value },
      ],
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [
        { translateY: formSlideY.value },
      ],
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: keyboardOffset.value },
      ],
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 1]
    );
    
    return {
      backgroundColor: `rgba(0, 168, 107, ${backgroundColor * 0.1})`,
    };
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <BackgroundTexture />
        
        <Animated.View style={[styles.contentContainer, containerAnimatedStyle, backgroundAnimatedStyle]}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
              <Ionicons 
                name="cash" 
                size={80} 
                color={Colors.light.primary} 
              />
            </Animated.View>
            <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
              <Text style={styles.appTitle}>Bucks & Balance</Text>
              <Text style={styles.subtitle}>Your Financial Companion</Text>
            </Animated.View>
          </View>

          {/* Decorative Divider */}
          <Animated.View style={[styles.divider, formAnimatedStyle]} />

          {/* Login/Signup Form Card */}
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </Text>
                <Text style={styles.formSubtitle}>
                  {isLogin ? 'Sign in to continue' : 'Join Bucks & Balance today'}
                </Text>
              </View>

              {/* Name Input - Only show for signup */}
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={20} color={Colors.light.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Full Name"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)" // Better contrast for glass
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              )}

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)" // Better contrast for glass
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color={Colors.light.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)" // Better contrast for glass
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="rgba(255, 255, 255, 0.7)" // Match glass theme
                  />
                </Pressable>
              </View>

              {/* Login Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed && styles.loginButtonPressed,
                ]}
                onPress={handleLogin}
                disabled={isAnimating}
              >
                <Text style={styles.loginButtonText}>
                  {isLogin ? 'Login' : 'Sign Up'}
                </Text>
                <Ionicons 
                  name="arrow-forward" 
                  size={20} 
                  color="white" 
                  style={styles.buttonIcon}
                />
              </Pressable>

              {/* Create Account Link - Moved inside the card */}
              <View style={styles.cardFooter}>
                <Pressable onPress={() => setIsLogin(!isLogin)}>
                  <Text style={styles.cardFooterText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <Text style={styles.cardFooterLink}>
                      {isLogin ? 'Create Account' : 'Sign In'}
                    </Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // #013220
  },
  contentContainer: {
    flex: 1,
    zIndex: 1, // Above background texture
  },
  
  // Background texture styles
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0, // Behind content
  },
  // Dramatic depth gradients - creating lighting effects
  dramaticGradient1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: 'rgba(0, 168, 107, 0.12)', // Bright green light from top
  },
  dramaticGradient2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: 'rgba(1, 30, 20, 0.25)', // Much darker bottom for dramatic depth
  },
  dramaticGradient3: {
    position: 'absolute',
    top: -height * 0.2, // Start above screen
    left: -width * 0.2, // Start left of screen
    width: width * 1.4, // Much wider than screen
    height: height * 0.8, // Taller to cover more area
    backgroundColor: 'rgba(0, 168, 107, 0.08)',
    transform: [{ skewY: '-15deg' }], // Angled lighting effect across entire screen
  },
  // Grain texture - using multiple small elements for texture
  grainTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  // Noise pattern using overlapping elements
  noisePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 168, 107, 0.03)',
  },

  // ===== LOGO SECTION STYLES =====
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 140,
    minHeight: 120,
  },
  logoWrapper: {
    padding: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text, // White
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF88', // Semi-transparent white
    textAlign: 'center',
  },

  // ===== DIVIDER STYLES =====
  divider: {
    height: 1,
    backgroundColor: Colors.light.primary,
    marginHorizontal: 60,
    marginVertical: 4,
    opacity: 0.3,
  },

  // ===== FORM SECTION STYLES =====
  formContainer: {
    flex: 2.5,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassmorphism effect
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  formHeader: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#FFFFFF88', // Semi-transparent white
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // More opaque glass effect
    borderRadius: 16, // Slightly more rounded
    paddingHorizontal: 18,
    paddingVertical: 2,
    marginBottom: 14,
    borderWidth: 1.5, // Thicker border
    borderColor: 'rgba(255, 255, 255, 0.4)', // More visible border
    shadowColor: 'rgba(0, 168, 107, 0.3)', // Green shadow glow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5, // Android shadow
  },
  inputIcon: {
    marginRight: 14, // Slightly more space
    color: Colors.light.primary,
    opacity: 0.9, // Subtle transparency for glass effect
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text, // White
    paddingVertical: 14, // More padding for better touch
    fontWeight: '500', // Slightly bolder text
  },
  eyeIcon: {
    padding: 4,
  },

  // ===== BUTTON STYLES =====
  loginButton: {
    backgroundColor: Colors.light.primary, // #00A86B
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonPressed: {
    backgroundColor: '#00D984', // Lighter green when pressed
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },

  // ===== FOOTER STYLES =====
  cardFooter: {
    marginTop: 12,
    alignItems: 'center',
  },
  cardFooterText: {
    color: Colors.light.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  cardFooterLink: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  bottomSpacer: {
    flex: 0.3,
    minHeight: 10,
  },
});
