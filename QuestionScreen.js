// QuestionScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import firebase from './firebaseConfig'; // Import your Firebase config

const QuestionScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [userEmail, setUserEmail] = useState(''); // Get the user email from Firebase auth
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [timerExpired, setTimerExpired] = useState(false);
  const [testLocked, setTestLocked] = useState(false); // State to lock the test

  useEffect(() => {
    // Fetch questions from Firestore on component mount
    const fetchQuestions = async () => {
      const questionsRef = firebase.firestore().collection('questions');
      const snapshot = await questionsRef.get();
      const fetchedQuestions = [];
      snapshot.forEach((doc) => {
        fetchedQuestions.push({ id: doc.id, ...doc.data() });
      });
      setQuestions(fetchedQuestions);

      // Get the user's email from Firebase auth
      const user = firebase.auth().currentUser;
      if (user) {
        setUserEmail(user.email);
        checkTestLock(user.email);
      }
    };
    fetchQuestions();

    // Start the timer on component mount
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  useEffect(() => {
    // Check if the timer has expired
    if (timer <= 0) {
      setTimerExpired(true);
      setTestLocked(true); // Lock the test on timer expiration
      lockTestForUser(userEmail); // Update test lock status in Firebase
    }
  }, [timer]);

  const checkTestLock = async (email) => {
    // Check if the test is locked for this user in Firebase
    const userDoc = await firebase.firestore().collection('user_answers').doc(email).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData.testLocked) {
        setTestLocked(true);
      }
    }
  };

  const lockTestForUser = async (email) => {
    // Update test lock status for this user in Firebase
    await firebase.firestore().collection('user_answers').doc(email).set({ testLocked: true }, { merge: true });
  };

  const handleAnswerSelection = (questionId, option) => {
    // Check if the timer has expired before allowing selection
    if (!timerExpired) {
      setSelectedAnswers({ ...selectedAnswers, [questionId]: option });
    } else {
      alert('Time is up! Test session expired.');
    }
  };

  const handleFinishTest = async () => {
    const unansweredQuestions = questions.filter((question) => !selectedAnswers[question.id]);

    if (timerExpired || unansweredQuestions.length > 0) {
      // Show a warning if the timer has expired or there are unanswered questions
      alert('Please answer all questions within the time limit!');
    } else {
      try {
        // Save user answers to Firestore
        const userAnswersRef = firebase.firestore().collection('user_answers').doc(userEmail);
        await userAnswersRef.set(selectedAnswers);
        setTestLocked(true); // Lock the test once completed
        lockTestForUser(userEmail); // Update test lock status in Firebase
        // Navigate to the completed test screen
        navigation.navigate('CompletedTest');
      } catch (error) {
        console.error('Error saving answers:', error);
      }
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {testLocked ? (
        <Text style={styles.testLockedText}>Test session locked. You have completed the test or the time expired.</Text>
      ) : timerExpired ? (
        <Text style={styles.timerExpiredText}>Time is up! Test session expired.</Text>
      ) : (
        <>
          <Text style={styles.headerText}>Select the correct options:</Text>
          <Text style={styles.timerText}>Time Remaining: {formatTime(timer)}</Text>
          {questions.map((question, index) => (
            <View key={question.id} style={[styles.questionContainer, index % 2 === 0 ? styles.borderContainer : null]}>
              <Text style={styles.questionText}>{question.question}</Text>
              <View style={styles.optionsContainer}>
                {question.options.map((option, optionIndex) => (
                  <TouchableOpacity
                    key={optionIndex}
                    style={[
                      styles.optionButton,
                      selectedAnswers[question.id] === option ? styles.selectedOption : null,
                    ]}
                    onPress={() => handleAnswerSelection(question.id, option)}
                    disabled={timerExpired}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.finishButton} onPress={handleFinishTest} disabled={timerExpired}>
            <Text style={styles.finishButtonText}>Finish Test</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    margin: 5,
  },
  optionText: {
    fontSize: 14,
  },
  finishButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  borderContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: 'lightblue',
  },
  disabledOption: {
    backgroundColor: '#ddd',
    opacity: 0.7,
  },
  timerExpiredText: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
  },
  testLockedText: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default QuestionScreen;
