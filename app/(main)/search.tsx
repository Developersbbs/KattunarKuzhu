import React, { useState, useRef } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Search, Info, Building2, MapPin, X, User, Briefcase } from "lucide-react-native";
import { TextInput, TouchableOpacity, ScrollView, FlatList, Animated, Keyboard } from "react-native";
import Gradient from "@/assets/Icons/Gradient";

// Define types for our data
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface Location {
  id: string;
  name: string;
}

interface SearchResult {
  id: string;
  type: 'category' | 'location' | 'business' | 'person';
  name: string;
  subtitle?: string;
}

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<{id: string, type: 'category' | 'location', name: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  // Sample data for categories
  const categories: Category[] = [
    { id: '1', name: 'Electricians', icon: <Building2 size={24} color={theme.tint} /> },
    { id: '2', name: 'PEP Builders', icon: <Building2 size={24} color={theme.tint} /> },
    { id: '3', name: 'Interior Decors', icon: <Building2 size={24} color={theme.tint} /> },
    { id: '4', name: 'Architects', icon: <Building2 size={24} color={theme.tint} /> },
    { id: '5', name: 'Plumbers', icon: <Building2 size={24} color={theme.tint} /> },
    { id: '6', name: 'Carpenters', icon: <Building2 size={24} color={theme.tint} /> },
    { id: '7', name: 'Painters', icon: <Building2 size={24} color={theme.tint} /> },
  ];

  // Sample data for locations
  const locations: Location[] = [
    { id: '1', name: 'T.Nagar' },
    { id: '2', name: 'Tambaram' },
    { id: '3', name: 'Chengalpet' },
    { id: '4', name: 'Velachery' },
    { id: '5', name: 'K.K.Nagar' },
    { id: '6', name: 'Adyar' },
    { id: '7', name: 'Porur' },
  ];

  // Sample search results based on query
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate search results
    const results: SearchResult[] = [];
    
    // Add matching categories
    categories
      .filter(cat => cat.name.toLowerCase().includes(query.toLowerCase()))
      .forEach(cat => {
        results.push({
          id: `cat-${cat.id}`,
          type: 'category',
          name: cat.name,
          subtitle: 'Category'
        });
      });
    
    // Add matching locations
    locations
      .filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()))
      .forEach(loc => {
        results.push({
          id: `loc-${loc.id}`,
          type: 'location',
          name: loc.name,
          subtitle: 'Location'
        });
      });
    
    // Add some sample businesses and people
    if (query.length > 2) {
      results.push(
        {
          id: 'bus-1',
          type: 'business',
          name: `${query} Services Ltd`,
          subtitle: 'Business'
        },
        {
          id: 'bus-2',
          type: 'business',
          name: `${query.charAt(0).toUpperCase() + query.slice(1)} Solutions`,
          subtitle: 'Business'
        },
        {
          id: 'per-1',
          type: 'person',
          name: `John ${query.charAt(0).toUpperCase() + query.slice(1)}`,
          subtitle: 'Business Owner'
        }
      );
    }
    
    setSearchResults(results);
  };

  // Handle tag selection
  const handleTagSelect = (id: string, type: 'category' | 'location', name: string) => {
    // Check if tag is already selected
    if (!selectedTags.some(tag => tag.id === id)) {
      setSelectedTags([...selectedTags, { id, type, name }]);
      
      // Update search based on new tags
      performSearch(searchQuery);
    }
  };

  // Handle tag removal
  const handleTagRemove = (id: string) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== id));
    
    // Update search based on remaining tags
    performSearch(searchQuery);
  };

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    performSearch(text);
    setShowSuggestions(text.length > 0);
  };

  // Handle search result selection
  const handleResultSelect = (result: SearchResult) => {
    if (result.type === 'category' || result.type === 'location') {
      const id = result.id.split('-')[1];
      handleTagSelect(id, result.type, result.name);
    }
    
    // Clear search and hide suggestions
    setSearchQuery("");
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  // Render category item
  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isSelected = selectedTags.some(tag => tag.id === item.id && tag.type === 'category');
    
    return (
      <TouchableOpacity 
        onPress={() => handleTagSelect(item.id, 'category', item.name)}
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
            {item.icon}
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
  const renderLocationItem = ({ item }: { item: Location }) => {
    const isSelected = selectedTags.some(tag => tag.id === item.id && tag.type === 'location');
    
    return (
      <TouchableOpacity 
        onPress={() => handleTagSelect(item.id, 'location', item.name)}
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

  // Get icon for result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'category':
        return <Building2 size={20} color={theme.tint} />;
      case 'location':
        return <MapPin size={20} color={theme.tint} />;
      case 'business':
        return <Briefcase size={20} color={theme.tint} />;
      case 'person':
        return <User size={20} color={theme.tint} />;
      default:
        return <Info size={20} color={theme.tint} />;
    }
  };

  return (
    <Box className="flex-1">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
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
              placeholder="Search members, businesses, categories..."
              placeholderTextColor={colorScheme === "dark" ? "#AAAAAA" : "#666666"}
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
            <Box className="absolute left-4 top-3">
              <Search size={24} color={colorScheme === "dark" ? "#AAAAAA" : "#666666"} />
            </Box>
          </Box>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <Box className="flex-row flex-wrap mt-3 gap-2">
              {selectedTags.map(tag => (
                <Box 
                  key={`${tag.type}-${tag.id}`}
                  className="flex-row items-center px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: colorScheme === "dark" ? 
                      (tag.type === 'category' ? "rgba(160, 118, 249, 0.2)" : "rgba(0, 100, 180, 0.2)") : 
                      (tag.type === 'category' ? "rgba(45, 18, 72, 0.1)" : "rgba(0, 120, 220, 0.1)")
                  }}
                >
                  {tag.type === 'category' ? 
                    <Building2 size={16} color={theme.tint} /> : 
                    <MapPin size={16} color={theme.tint} />
                  }
                  <Text 
                    className="mx-2 text-sm"
                    style={{ color: theme.text }}
                  >
                    {tag.name}
                  </Text>
                  <TouchableOpacity onPress={() => handleTagRemove(tag.id)}>
                    <X size={16} color={theme.text} />
                  </TouchableOpacity>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Search Suggestions */}
        {showSuggestions && searchResults.length > 0 && (
          <Box className="mx-4 mb-4 rounded-xl overflow-hidden"
            style={{ 
              backgroundColor: colorScheme === "dark" ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
              borderWidth: 1,
              borderColor: colorScheme === "dark" ? "rgba(80, 80, 80, 0.3)" : "rgba(0, 0, 0, 0.05)",
            }}
          >
            {searchResults.map((result) => (
              <TouchableOpacity 
                key={result.id}
                onPress={() => handleResultSelect(result)}
                activeOpacity={0.7}
              >
                <Box 
                  className="flex-row items-center p-3 border-b"
                  style={{ 
                    borderBottomColor: colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" 
                  }}
                >
                  <Box className="mr-3">
                    {getResultIcon(result.type)}
                  </Box>
                  <Box className="flex-1">
                    <Text style={{ color: theme.text }}>{result.name}</Text>
                    {result.subtitle && (
                      <Text 
                        className="text-xs"
                        style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
                      >
                        {result.subtitle}
                      </Text>
                    )}
                  </Box>
                </Box>
              </TouchableOpacity>
            ))}
          </Box>
        )}

        {!isSearching && (
          <>
            {/* Categories Section */}
            <Box className="w-full px-4 mb-2">
              <Text className="text-xl font-bold" style={{ color: theme.text }}>Categories</Text>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-2"
                contentContainerStyle={{ paddingRight: 20 }}
              />
            </Box>

            {/* Locations Section */}
            <Box className="w-full px-4 mb-2">
              <Text className="text-xl font-bold" style={{ color: theme.text }}>Locations</Text>
              <FlatList
                data={locations}
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

        {/* Empty State */}
        {isSearching && searchResults.length === 0 && (
          <Box className="items-center p-6 mt-6">
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
              Try adjusting your search or filters
            </Text>
          </Box>
        )}

        {/* Initial State */}
        {!isSearching && searchQuery === "" && selectedTags.length === 0 && (
          <Box className="items-center p-6 mt-6">
            <Search size={60} color={theme.tint} />
            <Text
              className="text-2xl font-bold mt-4"
              style={{ color: theme.text }}
            >
              Search
            </Text>
            <Text
              className="text-base text-center mt-2"
              style={{ color: colorScheme === "dark" ? "#AAAAAA" : "#666666" }}
            >
              Search for members, businesses, categories, and locations
            </Text>
          </Box>
        )}
      </ScrollView>
    </Box>
  );
} 