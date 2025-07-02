// Import necessary components and libraries from React Native and other dependencies
import { StyleSheet, Text, View, Pressable, Image, TextInput, ScrollView, StatusBar, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { theme } from '../../constants/themes'
import { hp, wp } from '../../helpers/common'
import CategoriesComponent from '../../components/CategoriesComponent'
import { apiCall } from '../../API'
import ImageGrid from '../../components/ImageGrid'
import { debounce } from 'lodash'
import FiltersComponent from '../../components/FiltersComponent'

// Define the Home functional component
const Home = () => {
  var page = 1;
  const { Top } = SafeAreaInsetsContext;
  const paddingTop = Top > 0 ? Top + 10 : 30;
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([])
  const [activeCategory, setActivecategory] = useState(null);
  const [filters, setFilters] = useState(null)

  const SearchInputRef = useRef(null);
  const Modalref = useRef(null)

  // Function to handle the search input changes
  const HandleSearch = (text) => {
    setSearch(text)
    if (text.length > 2) {
      // Search for images if text length is greater than 2
      page = 1;
      setImages([]);
      setActivecategory(null)//clear category while searching
      fetchImages({ page, q: text, ...filters }, false)
    }
    if (text == "") {
      // Reset results if search text is empty
      page = 1;
      SearchInputRef?.current?.clear();
      setActivecategory(null)//clear category while searching
      setImages([]);
      fetchImages({ page, ...filters }, false)
    }
  }

  // Debounce the search input changes to limit the API calls
  const handleTextDebounce = useCallback(debounce(HandleSearch, 400), [])

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, [])

  // Function to fetch images from the API
  const fetchImages = async (params = { page: 1 }, append = true) => {
    let res = await apiCall(params)
    if (res.success && res?.data?.hits) {
      if (append)
        setImages([...images, ...res.data.hits])
      else
        setImages([...res.data.hits])
    }
  }

  // Function to handle active category change
  const handleActiveCategory = (cat) => {
    setActivecategory(cat)
    clearSearch();
    setImages([]);
    page = 1
    let params = {
      page,
      ...filters
    }
    if (cat) params.category = cat;
    fetchImages(params, false)
  }

  // Function to clear the search input
  const clearSearch = () => {
    setSearch("");
    SearchInputRef?.current?.clear();
  }

  const OpenfiltersModal = () => {
    Modalref?.current?.present();
  }
  const ClosefiltersModal = () => {
    Modalref?.current?.close();
  }


  const Applyfilter = () => {
    ClosefiltersModal();
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters
      }
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search
      fetchImages(params, false)
    }
  }
  const Resetfilter = () => {
    ClosefiltersModal();

    if (filters) {
      page = 1;
      setFilters(null)
      setImages([]);
      let params = {
        page,

      }
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search
      fetchImages(params, false)
    }
  }


  const clearThisFilter = (filterName) => {
    let newFilters = { ...filters };
    delete newFilters[filterName];
    setFilters({ ...newFilters });
    page = 1;
    setImages([]);
    let params = {
      page,
      ...newFilters
    }
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false)
  }

  // Return the JSX layout for the Home screen
  return (
    <View style={[styles.container, { paddingTop }]}>
      <StatusBar
        barStyle={'dark-content'}
        translucent={true}
        backgroundColor={'transparent'}
      />
      <ScrollView contentContainerStyle={{ gap: 15 }}>
        <View style={styles.header}>
          <Pressable>
            <Text style={styles.headertext}>
              Zenith Walls
            </Text>
          </Pressable>
          <Pressable onPress={OpenfiltersModal}>
            <Image
              source={require('../../drawable/Icons/bars.png')}
              style={{ height: 22, width: 22 }}
            />
          </Pressable>
        </View>

        {/* Search bar */}
        <View style={styles.SearchBar}>
          <View style={styles.Icon}>
            <Image
              source={require('../../drawable/Icons/find.png')}
              style={styles.SearchIcon}
            />
          </View>
          <TextInput
            placeholder='search something'
            placeholderTextColor={theme.colors.black}
            ref={SearchInputRef}
            onChangeText={handleTextDebounce}
            style={styles.textInput}
          />
          {
            search && (
              <Pressable onPress={() => { HandleSearch("") }}>
                <Image
                  source={require('../../drawable/Icons/cross-button.png')}
                  style={styles.crossIcon}
                />
              </Pressable>
            )
          }
        </View>

        {/* Categories component */}
        <View style={styles.categories}>
          <CategoriesComponent
            activeCategory={activeCategory}
            handleActiveCategory={handleActiveCategory}
          />
        </View>




        {/* filters */}
        {
          filters && (
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.Filter}>
                {
                  Object.keys(filters).map((key, index) => {
                    return (
                      <View key={key} style={styles.filterItem}>
                        {
                          key == 'colors' ? (
                            <View style={{
                              height: 20,
                              width: 30,
                              borderRadius: 7,
                              backgroundColor: filters[key]
                            }}>

                            </View>
                          ) : (
                            <Text style={styles.filterItemText}>{filters[key]}</Text>
                          )
                        }

                        <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
                          <Image
                            source={require('../../drawable/Icons/cross-button.png')}
                            style={[styles.crossIcon, { height: 14, width: 14 }]}
                          />
                        </Pressable>
                      </View>
                    )

                  })
                }
              </ScrollView>
            </View>

          )
        }





        {/* Images masonry grid */}
        <View>
          {
            images.length > 0 && <ImageGrid
              images={images}
            />
          }
        </View>
        {/* Loading */}

        <View style={{ marginBottom: 70, margintop: images.length > 0 ? 10 : 70 }}>
          <ActivityIndicator
            size={'large'}
          />

        </View>

      </ScrollView >
      {/*Filters Modal */}
      < FiltersComponent
        Modalref={Modalref}
        filters={filters}
        setFilters={setFilters}
        onClose={ClosefiltersModal}
        onApply={Applyfilter}
        onReset={Resetfilter}
      />
    </View >
  )
}

// Export the Home component as the default export
export default Home

// Define the styles used in the Home component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  headertext: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.black
  },
  SearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    marginHorizontal: wp(4),
    paddingLeft: 10
  },
  crossIcon: {
    height: 24,
    width: 24,
    tintColor: theme.colors.black,
    padding: 8,
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.sm
  },
  SearchIcon: {
    height: 24,
    width: 24,
    tintColor: theme.colors.black,
    padding: 8
  },
  textInput: {
    flex: 1,
    fontSize: hp(1.8),
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    color: theme.colors.black
  },
  Filter: {
    gap: 10,
    paddingHorizontal: wp(4),
  },
  filterItem: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.xs,
    padding: 8,
    padding: 3,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.9),
    color: theme.colors.black,
    fontWeight: theme.fontWeights.medium
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7
  }
})
