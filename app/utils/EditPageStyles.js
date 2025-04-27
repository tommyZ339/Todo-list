import { StyleSheet } from 'react-native';
import { screenWidth } from '../stores/Dimensions';

const EditPageStyles = StyleSheet.create({
  formTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 20,
    marginLeft: 30,
    fontFamily: 'ZCOOL',
  },

  titleInput: {
    marginTop: 15,
    marginLeft: 30,
    height: 60,
    width: screenWidth - 60,
    borderRadius: 10,
    borderWidth: 3,
    padding: 10,
  },
  priorityInput: {
    height: 60,
    width: screenWidth - 60,
    borderRadius: 10,
    borderWidth: 3,
    padding: 10,
  },
  priorityDropDown: {
    marginTop: 15,
    marginLeft: 30,
    width: screenWidth - 60,
  },

  datePickerField: {
    height: 330,
    width: screenWidth - 60,
    marginTop: 10,
    marginLeft: 30,
  },

  timePrompt: {
    marginTop: 9,
    fontSize: 15,
  },

  timeChangeButton: {
    padding: 6,
    width: 45,
    height: 30,
    backgroundColor: '#ffba84',
    borderRadius: 10,
  }
});

export { EditPageStyles };
