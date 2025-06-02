import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import { db } from '../../utils/FirebaseConfig';
import {
  createTables,
  insertNote,
  getLocalNotes,
  getUnsyncedNotes,
  markNoteSynced,
} from '../../database/database';
import { Dimensions } from 'react-native';
import { globalStyles } from '../../styles/GlobalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigateBack } from '../../utils/Utils';

const NotesList = ({ route }) => {
  const { userId } = route.params;
  const [notes, setNotes] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const screenHeight = Dimensions.get('window').height;


  useEffect(() => {
    createTables();
    loadNotes();

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncUnsyncedNotes();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadNotes = async () => {
    const network = await NetInfo.fetch();
  
    if (network.isConnected) {
      try {
        const notesRef = collection(db, 'users', userId, 'notes');
        const snapshot = await getDocs(notesRef);
        const notesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);
      } catch (err) {
        console.error('Failed to load from Firestore:', err);
        getLocalNotes(userId, setNotes);
      }
    } else {
      getLocalNotes(userId, setNotes);
    }
  };
  

  const syncUnsyncedNotes = () => {
    getUnsyncedNotes(userId, async (unsyncedNotes) => {
      for (const note of unsyncedNotes) {
        try {
          await addDoc(collection(db, 'users', userId, 'notes'), {
            title: note.title,
            text: note.text,
          });
          await markNoteSynced(note.id);
          console.log('Synced note:', note.title);
        } catch (err) {
          console.error('Sync failed:', err);
        }
      }
  
      loadNotes();
    });
  };
  

  const handleAddNote = async () => {

    Keyboard.dismiss();
    if (title != '' && text != '') {

    
    setModalVisible(false);
  
    const network = await NetInfo.fetch();
  
    if (network.isConnected) {
      try {
        // 1. Add to Firestore first
        await addDoc(collection(db, 'users', userId, 'notes'), {
          title,
          text,
        });
  
        // 2. Add to local DB marked as synced (1)
        await insertNote(userId, title, text, 1);
  
        console.log('Note added to Firestore and local DB');
      } catch (err) {
        console.error('Failed to add to Firestore. Saving locally:', err);
  
        // 3. Save locally as unsynced (0)
        await insertNote(userId, title, text, 0);
      }
    } else {
      // 4. Offline, save locally as unsynced (0)
      await insertNote(userId, title, text, 0);
      console.log('Offline - note saved locally only');
    }
  
    setTitle('');
    setText('');
    getLocalNotes(userId, setNotes);
} else {
    Alert.alert('Invalid', 'Please enter valid title and text');
}
  };
  

  return (
    <ImageBackground
      source={require('../../../assets/images/commonbackground.png')}
      resizeMode="cover"
      style={globalStyles.imageBackground}>
      <SafeAreaView style={{flex: 1}}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
        <View>
            <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={navigateBack}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
          <FlatList
            data={notes}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={({ item }) => (
              <View style={styles.flatListItem}>
                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                <Text>{item.text}</Text>
              </View>
            )}
            style={{marginTop: 50}}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No results found</Text>}
          />

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addNoteButton}
          >
            <Text style={{ color: '#fff' }}>Add Note</Text>
          </TouchableOpacity>

          <Modal
        visible={isModalVisible}
        animationType="slide"
         transparent={true}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000055' }}>
        <View
          style={{
            height: screenHeight * 0.75,
            backgroundColor: '#fff',
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={{  marginBottom: 20,marginTop: 50,fontWeight: 'bold',fontSize: 26 }}
          />
          <TextInput
          placeholder="Text"
          value={text}
          onChangeText={setText}
          multiline
          style={styles.textStyle}
        />
          <View style={{marginTop: 100}}>
          <Button title="Add Note" onPress={handleAddNote} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
         
        </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default NotesList;

const styles = StyleSheet.create ({
    container: { flex: 1, padding: 16 },
    flatListItem: { padding: 10, marginBottom: 10, backgroundColor: '#E8E8E8', borderRadius: 8,borderWidth: 1,borderColor: '#047B4D' },
    logoutText:{
        fontWeight: 'bold',
        fontSize: 18     
    },
    addNoteButton: {
        backgroundColor: '#047B4D',
        padding: 16,
        borderRadius: 8,
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
      },
      textStyle:{
            backgroundColor: '#f2f2f2',
            borderRadius: 10,
            padding: 14,
            fontSize: 16,
            minHeight: 100,
            textAlignVertical: 'top',
            borderColor: '#047B4D',
            borderWidth: 1,
            marginTop: 25
      }
})
