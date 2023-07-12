   <Animated.View
                            style={{
                              backgroundColor: 'rgba(255,0,0,0.4)',
                              height: '80%',
                              width: '100%',
                              borderRadius: 0,
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'absolute',
                              opacity: bin
                            }}>
                            <View
                              style={{
                                backgroundColor: Colors.white,
                                height: 50,
                                width: 50,
                                borderRadius: 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Image
                                source={Images.deletelike}
                                style={{
                                  height: 25,
                                  width: 25,
                                  tintColor: 'red',
                                }}
                              />
                            </View>
                          </Animated.View>
                          <Animated.View
                            style={{
                              backgroundColor: 'rgba(0, 128, 0, .6)',
                              height: '80%',
                              width: '100%',
                              borderRadius: 0,
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'absolute',
                              opacity: fav

                            }}>
                            <View
                              style={{
                                backgroundColor: Colors.white,
                                height: 50,
                                width: 50,
                                borderRadius: 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Image
                                source={Images.favlike}
                                style={{
                                  height: 25,
                                  width: 25,
                                  // tintColor: 'transparent',
                                }}
                              />
                            </View>
                          </Animated.View>