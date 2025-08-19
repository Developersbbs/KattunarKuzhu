import React, { useState, useRef, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Search, Info, Building2, MapPin, X, User, Briefcase, ChevronRight } from "lucide-react-native";
import { TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Keyboard } from "react-native";
import { searchBusinesses, BusinessSearchResult } from "@/services/search";
import { useDebounce } from "@/hooks/useDebounce";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Image } from "@/components/ui/image";
import { Button, ButtonText } from "@/components/ui/button";
import { Link } from "expo-router";

// Sample data for categories (can be fetched from API in the future)
const popularCategories = [
  { id: '1', name: 'Electricians' },
  { id: '2', name: 'PEP Builders' },
  { id: '3', name: 'Interior Decors' },
  { id: '4', name: 'Architects' },
  { id: '5', name: 'Plumbers' },
  { id: '6', name: 'Carpenters' },
  { id: '7', name: 'Painters' },
];

// Sample data for locations (can be fetched from API in the future)
const popularLocations = [
  { id: '1', name: 'T.Nagar' },
  { id: '2', name: 'Tambaram' },
  { id: '3', name: 'Chengalpet' },
  { id: '4', name: 'Velachery' },
  { id: '5', name: 'K.K.Nagar' },
  { id: '6', name: 'Adyar' },
  { id: '7', name: 'Porur' },
];

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<BusinessSearchResult[]>([]);
  const searchInputRef = useRef<TextInput>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Perform search when debounced query or filters change
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery && !selectedCategory && !selectedLocation) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      const params = {
        q: debouncedSearchQuery,
        category: selectedCategory || undefined,
        location: selectedLocation || undefined,
      };
      const results = await searchBusinesses(params);
      setSearchResults(results);
      setIsLoading(false);
    };

    performSearch();
  }, [debouncedSearchQuery, selectedCategory, selectedLocation]);


  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(prev => prev === categoryName ? null : categoryName);
    setSelectedLocation(null); // Reset location when category is selected
  };

  // Handle location selection
  const handleLocationSelect = (locationName: string) => {
    setSelectedLocation(prev => prev === locationName ? null : locationName);
    setSelectedCategory(null); // Reset category when location is selected
  };

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Render category item
  const renderCategoryItem = ({ item }: { item: { id: string, name: string } }) => {
    const isSelected = selectedCategory === item.name;
    
    return (
      <TouchableOpacity 
        onPress={() => handleCategorySelect(item.name)}
        activeOpacity={0.7}
      >
        <Box 
          className="p-3 flex-col items-center justify-center gap-3"
          style={{ opacity: isSelected ? 0.7 : 1 }}
        >
          <Box 
            className="w-20 h-20 items-center justify-center rounded-full"
            style={{ 
              backgroundColor: colorScheme === "dark" ? 
                (isSelected ? "rgba(160, 118, 249, 0.3)" : "rgba(42, 42, 42, 0.8)") : 
                (isSelected ? "rgba(45, 18, 72, 0.15)" : "rgba(245, 245, 245, 0.8)")
            }}
          >
            <Building2 size={24} color={theme.tint} />
          </Box>
          <Text 
            className="text-sm font-medium text-center" 
            style={{ color: theme.text, maxWidth: 80 }}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </Box>
      </TouchableOpacity>
    );
  };

  // Render location item
  const renderLocationItem = ({ item }: { item: { id: string, name: string } }) => {
    const isSelected = selectedLocation === item.name;
    
    return (
      <TouchableOpacity 
        onPress={() => handleLocationSelect(item.name)}
        activeOpacity={0.7}
      >
        <Box 
          className="p-3 flex-col items-center justify-center gap-3"
          style={{ opacity: isSelected ? 0.7 : 1 }}
        >
          <Box 
            className="w-20 h-20 items-center justify-center rounded-full"
            style={{ 
              backgroundColor: colorScheme === "dark" ? 
                (isSelected ? "rgba(160, 118, 249, 0.3)" : "rgba(42, 42, 42, 0.8)") : 
                (isSelected ? "rgba(45, 18, 72, 0.15)" : "rgba(245, 245, 245, 0.8)")
            }}
          >
            <MapPin size={24} color={theme.tint} />
          </Box>
          <Text 
            className="text-sm font-medium" 
            style={{ color: theme.text }}
          >
            {item.name}
          </Text>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderResultCard = ({ item }: { item: BusinessSearchResult }) => (
    <Link href={`/(main)/profile/${item.owner?._id}`} asChild>
      <TouchableOpacity activeOpacity={0.8}>
        <Box 
          className="mb-4 mx-4 p-4 rounded-2xl"
          style={{ 
            backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "#fff",
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: colorScheme === 'dark' ? 0.2 : 0.05,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          {/* Top Section: Member + Business Info */}
          <Box className="flex-row items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage source={{ uri: item.owner?.profileImageUrl }} />
              <AvatarFallbackText>{item.owner?.name.charAt(0)}</AvatarFallbackText>
            </Avatar>

            <Box className="ml-4 flex-1">
              <Text className="text-lg font-bold" style={{ color: theme.text }} numberOfLines={1}>
                {item.owner?.name || 'N/A'}
              </Text>
              <Box className="flex-row items-center mt-1">
                {item.logoUrl ? (
                  <Image source={{ uri: item.logoUrl }} alt="Logo" className="w-5 h-5 rounded-sm" />
                ) : (
                  <Briefcase size={16} color={theme.tint} />
                )}
                <Text className="ml-2 text-sm" style={{ color: theme.text }} numberOfLines={1}>
                  {item.name}
                </Text>
              </Box>
              <Box className="flex-row items-center mt-1">
                <MapPin size={16} color={theme.tint} />
                <Text className="ml-2 text-xs" style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }} numberOfLines={1}>
                  {item.address}
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Bottom Section: View Details Button */}
          <Box className="mt-4 pt-3 border-t" style={{ borderColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}>
             <Box className="flex-row justify-between items-center">
                <Text style={{ color: theme.tint, fontWeight: '600' }}>View Details</Text>
                <ChevronRight size={20} color={theme.tint} />
            </Box>
          </Box>
        </Box>
      </TouchableOpacity>
    </Link>
  );


  return (
    <Box className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* Search Bar */}
      <Box className="w-full p-4">
        <Box className="relative">
          <TextInput 
            ref={searchInputRef}
            className="w-full h-12 rounded-full pl-12 pr-4"
            style={{
              backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(245, 245, 245, 0.8)",
              color: theme.text,
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
            }}
            placeholder="Search by business or member name..."
            placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          <Box className="absolute left-4 top-3">
            <Search size={24} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
          </Box>
        </Box>

        {/* Selected Tags */}
        <Box className="flex-row flex-wrap mt-3 gap-2">
          {selectedCategory && (
             <Box 
                className="flex-row items-center px-3 py-1 rounded-full"
                style={{ backgroundColor: colorScheme === "dark" ? "rgba(160, 118, 249, 0.2)" : "rgba(45, 18, 72, 0.1)" }}
              >
                <Building2 size={16} color={theme.tint} />
                <Text className="mx-2 text-sm" style={{ color: theme.text }}>{selectedCategory}</Text>
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                  <X size={16} color={theme.text} />
                </TouchableOpacity>
              </Box>
          )}
           {selectedLocation && (
             <Box 
                className="flex-row items-center px-3 py-1 rounded-full"
                style={{ backgroundColor: colorScheme === "dark" ? "rgba(0, 100, 180, 0.2)" : "rgba(0, 120, 220, 0.1)" }}
              >
                <MapPin size={16} color={theme.tint} />
                <Text className="mx-2 text-sm" style={{ color: theme.text }}>{selectedLocation}</Text>
                <TouchableOpacity onPress={() => setSelectedLocation(null)}>
                  <X size={16} color={theme.text} />
                </TouchableOpacity>
              </Box>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <FlatList
        data={searchResults}
        renderItem={renderResultCard}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* Show popular categories/locations only when not actively searching */}
            {!searchQuery && !selectedCategory && !selectedLocation && (
              <>
                <Box className="w-full px-4 mb-2">
                  <Text className="text-xl font-bold" style={{ color: theme.text }}>Popular Categories</Text>
                  <FlatList
                    data={popularCategories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-2"
                    contentContainerStyle={{ paddingRight: 20 }}
                  />
                </Box>
                <Box className="w-full px-4 mb-2">
                  <Text className="text-xl font-bold" style={{ color: theme.text }}>Popular Locations</Text>
                  <FlatList
                    data={popularLocations}
                    renderItem={renderLocationItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-2"
                    contentContainerStyle={{ paddingRight: 20 }}
                  />
                </Box>
              </>
            )}
          </>
        }
        ListEmptyComponent={
          <Box className="items-center p-6 mt-6">
            {isLoading ? (
              <ActivityIndicator size="large" color={theme.tint} />
            ) : (
              <>
                <Info size={60} color={theme.tint} />
                <Text
                  className="text-2xl font-bold mt-4"
                  style={{ color: theme.text }}
                >
                  No Results
                </Text>
                <Text
                  className="text-base text-center mt-2"
                  style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                >
                  Try adjusting your search or filters.
                </Text>
              </>
            )}
          </Box>
        }
      />
    </Box>
  );
} 