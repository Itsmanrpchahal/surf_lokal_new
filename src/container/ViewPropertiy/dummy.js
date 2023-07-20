{data
    .slice(0, 2)
    .reverse()
    .map((item, index, items) => {
      return (
        <>
          <View style={{ position: 'relative', width: '100%' }}>
            <View style={styles.headerIcon}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.screen}>
                <Image source={Images.downArrow} style={styles.imagedata}></Image>
              </TouchableOpacity>
            </View>
            <View
              >
              <View>
                <View onPress={() => navigation.navigate('ViewPropertiyImage', { postid: postid.item.ID })} >
                  <Image
                    source={{ uri: property?.featured_image_src }} style={styles.slide} />
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: Colors.white,
                //paddingHorizontal: 12,
                paddingVertical: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setProductId(item.ID);
                    setReviewTitle(item.title);
                    toggleModal();
                  }}>
                  <Image
                    source={Images.star}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      marginTop: -6,
                    }}></Image>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.black,
                    textAlign: 'center',
                    marginLeft: 5,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  {store.getState().getPopertiesDetails.getPopertiesDetails.data[0].Total_average_rating}
                </Text>
              </View>
              <Text
                onPress={() => navigation.navigate('ViewPropertiyImage', { postid: postid.item.ID })}
                style={{
                  fontSize: 20,
                  color: Colors.primaryBlue,
                  fontWeight: '500',
                  fontFamily: 'Poppins-SemiBold',
                }}>
                {store.getState().getPopertiesDetails.getPopertiesDetails.data[0]?.price}
              </Text>
              <TouchableOpacity onPress={() => handleShare()}>
                <Image
                  source={Images.send}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>
            <KeyboardAvoidingView>
              <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={toggleModal}>
                <View
                  style={{

                    // height: '80%',
                    width: '100%',
                    alignItems: 'center',
                    alignContent: 'center',
                    backgroundColor: Colors.white,
                    position: 'absolute',
                    bottom: 10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderWidth: 1,
                    borderColor: Colors.gray,
                  }}>
                  <View
                    style={{
                      height: '10%',
                      width: '90%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.gray,
                        }}></Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>

                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '700',
                          color: Colors.black,
                          marginTop: 10,
                          fontFamily: 'Poppins-Regular',
                        }}>
                        Rate and Review
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                      }}>
                      <Image
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                          tintColor: Colors.black,
                          transform: [{ rotate: '45deg' }],
                        }}
                        source={Images.plus}></Image>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor: Colors.gray,
                      marginTop: 10,
                      justifyContent: 'center',
                    }}></View>
                  <View style={{ width: '95%', height: '70%' }}>
                    <View
                      style={{ width: '95%', alignSelf: 'center' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: Colors.black,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Photos Quality Rating :
                        </Text>
                        <Rating
                          type="custom"
                          ratingCount={5}
                          imageSize={25}
                          startingValue={rating}
                          ratingBackgroundColor="#c8c7c8"
                          onFinishRating={setRating}
                          style={styles.rating}
                          ratingColor="blue"
                        //tintColor="#f1f3f4"
                        />
                      </View>
                    </View>

                    <View
                      style={{ width: '95%', alignSelf: 'center' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: Colors.black,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Description & Details :
                        </Text>
                        <Rating
                          type="custom"
                          ratingCount={5}
                          imageSize={25}
                          startingValue={rating}
                          ratingBackgroundColor="#c8c7c8"
                          onFinishRating={setRating}
                          style={styles.rating}
                          ratingColor="blue"
                        //tintColor="#f1f3f4"
                        />
                      </View>
                    </View>
                    <View
                      style={{ width: '95%', alignSelf: 'center' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: Colors.black,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Price Of Property :
                        </Text>
                        <Rating
                          type="custom"
                          ratingCount={5}
                          imageSize={25}
                          startingValue={rating}
                          ratingBackgroundColor="#c8c7c8"
                          onFinishRating={setRating}
                          style={styles.rating}
                          ratingColor="blue"
                        //tintColor="#f1f3f4"
                        />
                      </View>
                    </View>

                    <View
                      style={{ width: '95%', alignSelf: 'center' }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: Colors.black,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          General Interest in the property :
                        </Text>
                        <Rating
                          type="custom"
                          ratingCount={5}
                          imageSize={25}
                          startingValue={rating}
                          ratingBackgroundColor="#c8c7c8"
                          onFinishRating={setRating}
                          style={styles.rating}
                          ratingColor="blue"
                        //tintColor="#f1f3f4"
                        />
                      </View>
                    </View>

                    <View style={{ height: 20 }}></View>
                    <View
                      style={{ width: '95%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.black,
                          marginTop: 12,
                          fontFamily: 'Poppins-Regular',
                        }}>
                        Review
                      </Text>
                      <View
                        style={{
                          width: '100%',
                          height: 100,
                          marginTop: 10,
                          //justifyContent: 'center',
                        }}>
                        <TextInput
                          // allowFontScaling={false}
                          style={{
                            width: '100%',
                            borderRadius: 8,
                            height: '100%',
                            paddingHorizontal: 12,
                            color: Colors.black,
                            borderWidth: 1,
                            borderColor: Colors.gray,
                            fontSize: 14,
                            // padding: 2,
                            alignItems: 'flex-start',
                            alignSelf: 'flex-start',
                            verticalAlign: 'top',
                            fontFamily: 'Poppins-Regular',
                          }}
                          //keyboardType="default"
                          autoCorrect={false}
                          returnKeyType="done"
                          placeholderTextColor={Colors.gray}
                          placeholder="Write a review..."
                          onChangeText={text => setReview(text)}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        width: '100%',

                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingHorizontal: 10,
                      }}>
                      <TouchableOpacity
                        onPress={() => addReview()}
                        // onPress={() => setModalVisible(false)}
                        // onPress={Alert.alert("Hyy")}
                        style={{
                          height: 35,
                          width: '45%',
                          borderRadius: 5,
                          backgroundColor: Colors.PrimaryColor,
                          marginTop: 10,

                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '700',
                            color: Colors.white,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Submit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </KeyboardAvoidingView>
            <View
              style={{
                justifyContent: 'space-between',
                backgroundColor: Colors.white,
              }}>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  backgroundColor: Colors.white,
                  paddingHorizontal: 12,
                }}>
                <Text
                  onPress={() => navigation.navigate('ViewPropertiyImage', { postid: postid.item.ID })}
                  style={{
                    fontSize: 14,
                    color: Colors.black,
                    marginBottom: 15,
                    textAlign: 'center',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {item.title}
                </Text>
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              width: '100%',
              // alignItems: "flex-start", 
              justifyContent: 'space-between',

            }}>
             
            </View>

          </View >

        </>
      );
    })}