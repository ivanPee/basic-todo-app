import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, TouchableWithoutFeedback, StyleSheet, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AppLoader from '../../component/AppLoader';


const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [newTodo, setNewTodo] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTodoId, setEditTodoId] = useState(null);
    const [todos, setTodos] = useState([
        { id: 1, text: 'Call Elon', completed: false, time: '11:00 Mo (Jan 30)' },
        { id: 2, text: 'Meet Irchick', completed: false, time: '16:00-17:00 Mo (Jan 30)' },
        { id: 3, text: 'Finish dribbble', completed: false, time: '' },
        { id: 4, text: 'Meet Uriyovich', completed: false, time: '21:00 Mo (Jan 30)' },
        { id: 5, text: 'Post to sharovary', completed: false, time: '' },
    ]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = () => {
        setLoading(true)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                axios.get("http://192.168.1.10:8055/api/get-todo").then(response => {
                    const transformedData = transformData(response.data);

                    resolve(setTodos(transformedData));
                    setFilteredTodos(transformedData);
                    setLoading(false)
                }).catch(error => reject('There was an error: ' + error));
            }, 50)
        })
    }

    const transformData = (data) => {
        return data.map(item => ({
            id: item.id,
            text: item.todo_text,
            completed: item.status === 'published' ? false : true,
            time: formatDate(item.date_created)
        }));
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { hour: '2-digit', minute: '2-digit', weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    useEffect(() => {
        fetchData();
        // setFilteredTodos(todos);
    }, []);

    const handleSearchChange = (text) => {
        setSearchQuery(text);
        const filteredTodos = text === ''
            ? todos
            : todos.filter((todo) => todo.text.toLowerCase().includes(text.toLowerCase()));
        setFilteredTodos(filteredTodos);
    };

    const handleAddTodo = () => {
        setLoading(true)
        if (newTodo.trim() !== '') {
            if (isEditing) {

                axios.patch('http://192.168.1.10:8055/api/edit-todo', {
                    "id": editTodoId,
                    "todo_text": newTodo,
                    "status": 'published',
                }).then(response => {
                    setIsEditing(false);
                    setEditTodoId(null);
                    fetchData();
                }).catch(error => console.log('There was an error: ' + error));
            } else {

                axios.post('http://192.168.1.10:8055/api/add-todo', {
                    "todo_text": newTodo,
                    "status": 'published',
                }).then(response => {
                    fetchData();
                }).catch(error => reject('There was an error: ' + error));
            }
            setNewTodo('');
            setShowInput(false);
        }
        setLoading(false)
    };

    const handleEditTodo = (id, text) => {
        setNewTodo(text);
        setShowInput(true);
        setIsEditing(true);
        setEditTodoId(id);
    };

    const handleTodoPress = (id, text, status) => {
        setLoading(true)
        axios.patch('http://192.168.1.10:8055/api/edit-todo', {
            "id": id,
            "todo_text": text,
            "status": status ? 'published' : 'archived',
        }).then(response => {
            fetchData();
            setLoading(false)
        }).catch(error => {console.log('There was an error: ' + error), setLoading(false)});
    };

    const handleDeleteTodo = (id) => {
        setLoading(true)
        axios.patch('http://192.168.1.10:8055/api/delete-todo', {
            "id": id
        }).then(response => {
            fetchData();
        }).catch(error => {console.log('There was an error: ' + error), setLoading(false)});
    };

    const getCurrentDate = () => {
        const date = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const getCurrentTime = () => {
        const date = new Date();
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.container}>
            <AppLoader visible={loading} />
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerText}>Today</Text>
                    <Text style={styles.dateText}>{getCurrentDate()} - {getCurrentTime()}</Text>
                </View>
                <TouchableOpacity onPress={() => setShowInput(true)} style={{ alignSelf: 'center' }}>
                    <MaterialIcons name="note-add" size={26} color="#fff" />
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.searchInput}
                placeholder="Search todos..."
                value={searchQuery}
                placeholderTextColor="#999"
                onChangeText={handleSearchChange}
            />
            <ScrollView style={styles.scrollContainer}>
                {filteredTodos.map((todo) => (
                    <View key={todo.id} style={styles.todoItem}>
                        <TouchableOpacity onPress={() => handleTodoPress(todo.id, todo.text, todo.completed)} style={styles.todoTextContainer}>
                            <Text style={[styles.todoText, todo.completed && styles.completedText]}>
                                {todo.text}
                            </Text>
                            <Text style={styles.todoTime}>{todo.time}</Text>
                        </TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => handleEditTodo(todo.id, todo.text)}>
                                <Ionicons
                                    name="create-outline"
                                    size={20}
                                    color="#21334d"
                                />
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => handleDeleteTodo(todo.id)}>
                                <Ionicons
                                    name="trash-outline"
                                    size={20}
                                    color="#21334d"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
            {showInput && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={showInput}
                    onRequestClose={() => setShowInput(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowInput(false)}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.inputField}
                                        placeholder="Add a new todo"
                                        value={newTodo}
                                        placeholderTextColor="#999"
                                        onChangeText={setNewTodo}
                                        onSubmitEditing={handleAddTodo}
                                    />
                                    <View style={styles.inputButtonsContainer}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowInput(false);
                                                setNewTodo('');
                                            }}
                                            style={[styles.cancelButton, { marginRight: 10 }]}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
                                            <Text style={styles.addButtonText}>{isEditing ? 'Save' : 'Done'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E90FF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    dateText: {
        fontSize: 16,
        color: '#fff',
        marginTop: 5,
    },
    scrollContainer: {
        flex: 1,
        padding: 20,
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
        color: '#21334d',
    },
    todoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    todoTextContainer: {
        flex: 1,
    },
    todoText: {
        fontSize: 18,
        color: '#21334d',
    },
    todoTime: {
        fontSize: 14,
        color: '#999',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#ccc',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '17%'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'flex-end',
    },
    inputContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
        alignItems: 'center',
        paddingBottom: 40,
    },
    inputField: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        marginTop: 10,
        color: '#21334d'
    },
    inputButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
    },
    cancelButton: {
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: '#FF0000',
    },
    addButton: {
        backgroundColor: '#1E90FF',
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 5,

    },
    addButtonText: {
        color: 'white',
    },
});

export default Home;
