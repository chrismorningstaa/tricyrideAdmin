import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  apiUserLogin,
  apiCreateUser,
  apiEmailVerify,
} from "../../api/accountService";
import { useUser } from "../utils/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen = ({ navigation }: { navigation: any }) => {
  // State for screen mode (login or register)
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    age: "",
    genderId: 1, // Default value
    emailAddress: "",
    phoneNumber: "",
    password: "",
    otp: "",
  });

  // OTP modal state
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { setUserData } = useUser();

  // Handle login submission
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiUserLogin({
        email: loginData.email,
        password: loginData.password,
      });

      await AsyncStorage.setItem("authToken", response.data.token);
      setUserData(response.data.user);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending OTP for registration
  const handleSendOTP = async () => {
    if (!registerData.emailAddress) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    setIsLoading(true);
    try {
      await apiEmailVerify({
        email: registerData.emailAddress,
      });

      setOtpModalVisible(true);
      Alert.alert("Success", "OTP sent to your email");
    } catch (error) {
      console.error("Send OTP error:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verify OTP and create account
  const handleVerifyAndCreate = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiCreateUser({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        middleName: registerData.middleName,
        age: registerData.age ? parseInt(registerData.age) : null,
        genderId: registerData.genderId,
        emailAddress: registerData.emailAddress,
        phoneNumber: registerData.phoneNumber,
        password: registerData.password,
        otp: otp,
      });

      // await AsyncStorage.setItem("authToken", response.data.token);
      setUserData(response.data);
      setOtpModalVisible(false);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Error",
        "Failed to verify OTP or create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between login and register modes
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  // Render login form
  const renderLoginForm = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Login</Text>

        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          value={loginData.email}
          onChangeText={(text) => setLoginData({ ...loginData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#aaa"
          value={loginData.password}
          onChangeText={(text) =>
            setLoginData({ ...loginData, password: text })
          }
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!loginData.email || !loginData.password || isLoading) &&
              styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!loginData.email || !loginData.password || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchModeButton} onPress={toggleMode}>
          <Text style={styles.switchModeText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render registration form
  const renderRegistrationForm = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Register</Text>

          <Text style={styles.inputLabel}>First Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            placeholderTextColor="#aaa"
            value={registerData.firstName}
            onChangeText={(text) =>
              setRegisterData({ ...registerData, firstName: text })
            }
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Last Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            placeholderTextColor="#aaa"
            value={registerData.lastName}
            onChangeText={(text) =>
              setRegisterData({ ...registerData, lastName: text })
            }
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Middle Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your middle name (optional)"
            placeholderTextColor="#aaa"
            value={registerData.middleName}
            onChangeText={(text) =>
              setRegisterData({ ...registerData, middleName: text })
            }
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Age*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor="#aaa"
            value={registerData.age}
            onChangeText={(text) =>
              setRegisterData({ ...registerData, age: text })
            }
            keyboardType="number-pad"
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Gender ID*</Text>
          <View style={styles.genderSelector}>
            <TouchableOpacity
              style={[
                styles.genderOption,
                registerData.genderId === 1 && styles.selectedGender,
              ]}
              onPress={() => setRegisterData({ ...registerData, genderId: 1 })}
            >
              <Text
                style={
                  registerData.genderId === 1
                    ? styles.selectedGenderText
                    : styles.genderText
                }
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderOption,
                registerData.genderId === 2 && styles.selectedGender,
              ]}
              onPress={() => setRegisterData({ ...registerData, genderId: 2 })}
            >
              <Text
                style={
                  registerData.genderId === 2
                    ? styles.selectedGenderText
                    : styles.genderText
                }
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Email Address*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            value={registerData.emailAddress}
            onChangeText={(text) =>
              setRegisterData({ ...registerData, emailAddress: text })
            }
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Phone Number*</Text>
          <View style={styles.phoneInputContainer}>
            <Text style={styles.countryCode}>+63</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter your phone number"
              placeholderTextColor="#aaa"
              value={registerData.phoneNumber}
              onChangeText={(text) =>
                setRegisterData({ ...registerData, phoneNumber: text })
              }
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>

          <Text style={styles.inputLabel}>Password*</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#aaa"
            value={registerData.password}
            onChangeText={(text) =>
              setRegisterData({ ...registerData, password: text })
            }
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!isFormValid() || isLoading) && styles.buttonDisabled,
            ]}
            onPress={handleSendOTP}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchModeButton}
            onPress={toggleMode}
          >
            <Text style={styles.switchModeText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      registerData.firstName &&
      registerData.lastName &&
      registerData.age &&
      registerData.emailAddress &&
      registerData.phoneNumber &&
      registerData.password
    );
  };

  // Render OTP Modal
  const renderOtpModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={otpModalVisible}
        onRequestClose={() => setOtpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalDescription}>
              A verification code has been sent to your email address. Please
              enter the code below to verify your account.
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              placeholderTextColor="#aaa"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!otp || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleVerifyAndCreate}
              disabled={!otp || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Verify & Create</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setOtpModalVisible(false)}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <View style={styles.header}>
          <Text style={styles.logoText}>TRICYRIDE</Text>
          <Text style={styles.tagline}>ANG SERVICE NG BAYAN</Text>
        </View>

        {isLoginMode ? renderLoginForm() : renderRegistrationForm()}
        {renderOtpModal()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefae0",
  },
  keyboardAvoidView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#283618",
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    color: "#606c38",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#283618",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#283618",
    marginTop: 15,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#606c38",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#283618",
    marginBottom: 15,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  countryCode: {
    fontSize: 16,
    color: "#283618",
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#283618",
  },
  genderSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedGender: {
    backgroundColor: "#606c38",
    borderColor: "#606c38",
  },
  genderText: {
    color: "#606c38",
  },
  selectedGenderText: {
    color: "white",
  },
  primaryButton: {
    backgroundColor: "#606c38",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#a0a0a0",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#606c38",
    fontSize: 16,
    fontWeight: "600",
  },
  switchModeButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchModeText: {
    color: "#606c38",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#283618",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: "#606c38",
    marginBottom: 20,
    textAlign: "center",
  },
  otpInput: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#283618",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 5,
  },
});

export default WelcomeScreen;
