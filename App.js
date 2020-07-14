import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView, TextInput, Dimensions, UIManager } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    OwnerPhoto: null,
    OwnerPhotouri: null,
    Inputurl: '',
  }

  render() {
    // let { OwnerPhoto } = this.state;
    // let imageUri = OwnerPhoto ? `data:image/jpg;base64,${this.state.OwnerPhoto}` : null;
    // imageUri && console.log({uri: imageUri.slice(0,10)});
    // console.log({uri: imageUri.slice(0, 100)})
    let {  OwnerPhotouri } = this.state;
    const { width, height } = Dimensions.get('window')
    return (
      <View style={styles.container}>
        {/* <Text>Farheen Ghanchi</Text> */}
        {/* <Text style={{ paddingLeft: 13, fontSize: 16, top: 5 }}>URL</Text> */}
        <Text style={{ fontSize: 30, top: 5 }}>URL</Text>
        <TextInput
          name='username'
          value={this.state.Inputurl}
          placeholder='Please Enter URL'
          onChangeText={(text) => this.setState({ Inputurl: text })}
          // autoCapitalize='characters'
          maxLength={50}
          style={styles.inputBox}
          backgroundColor="#ff8000"
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholderTextColor="#ffffff"
          selectionColor="#fff"

        />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: '#2c98fd',
          width,
          position: 'absolute',
          bottom: 0,
          padding: 20,
        }}
        >
          <TouchableOpacity onPress={this.MakeRemoteRequest}>
            <Icon size={50} name="photo" color="red" style={{ left: 6 }} />
            <Text style={{ color: 'red', fontSize: 18, alignItems: 'center', }}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._pickCamera}>
            <Icon size={50} name="photo-camera" color="red" style={{ left: 6 }} />
            <Text style={{ color: 'red', fontSize: 18, alignItems: 'center', }}>Camera</Text>
          </TouchableOpacity>
        </View>
       
        {/* For Add Mode */}
        {OwnerPhotouri &&
          <Image source={{ uri: OwnerPhotouri }} style={{ width: 400, height: 400 , top: -5 ,resizeMode:'contain'  }} quality={0.4}  />}
          
          {/* <Image source={{ uri: `data:image/jpg;base64,${(this.state.OwnerPhoto)}` }}  style={{ width: 400, height: 400, resizeMode: 'contain' ,top:-5}}  /> */}
          {/* <Image source={{ uri: imageUri }} style={{ width: 400, height: 400, resizeMode: 'contain', top: - 5  }}  /> */}
         
      </View>
    )
  };


  // Primary Detail ---  Camera
  _pickCamera = async () => {
    const cameraRollPerms = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const cameraPerms = await Permissions.askAsync(Permissions.CAMERA);
    // Alert.alert(cameraPerms.status +'.......'+cameraRollPerms.status)
    if (cameraPerms.status.toLowerCase() == "granted") {
      const options = {
        // mediaTypes: ImagePicker.MediaTypeOptions.Images,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        mode: 'single', // use "multiple" for multiple selection
        allowsEditing: true,
        //aspect: [2, 1], //work
        //aspect: [1, 1],
        quality: 0.3,
        base64: true,
        exif: false,
        //compress: 0.5,
       // resizeMode: 'Contain'
        //autoFocus:'on',
        //skipProcessing:true,
        //type:back,
        //flashMode:'on',
       // //zoom:0,
        //whiteBalance:'auto',
        //ratio:16:9,
        // change 
        //mediaTypes: ImagePicker.MediaTypeOptions.All,
        //allowsEditing: true,
       // aspect: [4, 3],
        //quality: 1,
      };
      let primaryCameraimg = await ImagePicker.launchCameraAsync(options);
       //console.log(primaryCameraimg.base64)
     // this.setState({ OwnerPhoto: primaryCameraimg.base64 });
      //console.log(OwnerPhoto)
      //this.setState({ OwnerPhotouri: primaryCameraimg.uri });

      if (!primaryCameraimg.cancelled) {
        console.log('Taking photo');
        this.setState({ OwnerPhoto: primaryCameraimg.base64 });
        //console.log(OwnerPhoto)
        this.setState({ OwnerPhotouri: primaryCameraimg.uri });
      }
    } else {
      alert('Sorry, we need camera roll permissions to make this work!')
    }
  };

  MakeRemoteRequest = () => {
    //http://0af4f5b8.ngrok.io
    const result = this.state.OwnerPhoto
    if (this.state.Inputurl == '' || result == '') {
      alert('Please Fill up and Capture image');
    }
    else {
      fetch(this.state.Inputurl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: result
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('check responce' + responseJson.result)
          this.setState({
            chechResult: responseJson.result
          }),
            Alert.alert(this.state.chechResult)
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    width: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 22,
    color: '#ffffff',
    marginVertical: 10,
    paddingVertical: 7,
   // position: 'absolute',
  }
});
