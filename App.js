import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Image, Dimensions, TouchableOpacity } from "react-native";
import Gallery from "react-native-image-gallery";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMG_MARGIN = 18;
const IMG_DEFAULT_WIDTH = 1300;
const IMG_DEFAULT_HEIGHT = 975;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      imgList: this.processList(),
      showFullScreenGallery: false,
      selectedIndex: 0
    };
  }
  processList = () => {
    let groupsedList = [];
    let fullList = [];
    let flag = false;
    let length = 20;
    let uri = "https://picsum.photos/200?random=";
    let i = 0;

    while (1) {
      if (i < length) {
        if (flag && i + 1 < length) {
          groupsedList.push([
            { id: i, title: "Image_" + i, uri: uri + i },
            { id: i + 1, title: "Image_" + (i + 1), uri: uri + (i + 1) }
          ]);
          fullList.push({ source: { uri: uri + i } });
          fullList.push({ source: { uri: uri + (i + 1) } });
          i += 2;
          flag = !flag;
        } else {
          groupsedList.push([{ id: i, title: "Image_" + i, uri: uri + i }]);
          fullList.push({ source: { uri: uri + i } });
          i++;
          flag = !flag;
        }
      } else {
        break;
      }
    }
    return { fullList: fullList, groupsedList: groupsedList };
  };

  renderItem = ({ item, index }) => {
    return (
      <View key={item[0].id + index} style={{ flex: 1, flexDirection: "row" }}>
        {item.map((value, index2) => {
          let image_width = 0;
          if (item.length === 1) {
            image_width = SCREEN_WIDTH - IMG_MARGIN - IMG_MARGIN;
          } else {
            image_width = (SCREEN_WIDTH - IMG_MARGIN - IMG_MARGIN - IMG_MARGIN) / 2;
          }
          let image_height = (IMG_DEFAULT_HEIGHT / IMG_DEFAULT_WIDTH) * image_width;

          return (
            <View
              key={value.id + index + index2}
              style={[
                { flex: 1, flexGrow: 1 },
                {
                  paddingTop: index === 0 ? 36 : 0,
                  paddingLeft: index2 === 1 ? 0 : IMG_MARGIN,
                  paddingRight: IMG_MARGIN,
                  paddingBottom: IMG_MARGIN
                }
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  this.setState({ showFullScreenGallery: true, selectedIndex: value.id });
                }}
              >
                <Image
                  source={{
                    uri: value.uri
                  }}
                  resizeMode="cover"
                  style={{
                    backgroundColor: "#eeeeee",
                    height: image_height,
                    borderRadius: 4
                  }}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    console.log(this.state.imgList.fullList);
    return (
      <View style={{ flex: 1 }}>
        <FlatList data={this.state.imgList.groupsedList} renderItem={this.renderItem} keyExtractor={item => item[0].id + "key"} />
        {this.state.showFullScreenGallery && (
          <>
            <View style={{ flex: 1, position: "absolute" }}>
              <Gallery
                style={{ flex: 1, backgroundColor: "black" }}
                images={this.state.imgList.fullList}
                maxScale={2}
                initialPage={this.state.selectedIndex}
                flatListProps={{
                  windowSize: 1,
                  initialNumToRender: 1,
                  initialScrollIndex: this.state.selectedIndex,
                  getItemLayout: (data, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index
                  })
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                flex: 1,
                position: "absolute",
                zIndex: 100000,
                top: 40,
                right: 20,
                borderRadius: 25,
                width: 38,
                height: 38,
                backgroundColor: "rgba(255,255,252,0.5)",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                this.setState({
                  showFullScreenGallery: false
                });
              }}
            >
              <Text style={{ color: "#fff" }}>×</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}
