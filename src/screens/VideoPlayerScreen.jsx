import * as React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import {
  useRoute,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import { XMarkIcon } from "react-native-heroicons/solid";

export default function VideoPlayerScreen() {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const route = useRoute();
  const navigation = useNavigation();
  const { source } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

      if (video.current) {
        video.current.playAsync();
      }

      return () => {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: source,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        shouldPlay
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <XMarkIcon color="white" size={30} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 10,
  },
});
