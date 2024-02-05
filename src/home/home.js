import React, {useEffect, useRef, useState} from "react";
import {Box, FlatList, HStack, Icon, Input, Pressable} from "native-base";
import Books from "../books/books";
import {MaterialIcons} from "@expo/vector-icons";
import data from "../books/booksData";
import {eventManager} from "../EventManager";

export default function Home({ navigation }) {

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(data);
    const [isInputVisible, setIsInputVisible] = useState(true);
    const inputRef = useRef(null);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = (event) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        if (currentScrollY < lastScrollY) {
            setIsInputVisible(true); // Mostra o Input quando rola para cima
        } else if (currentScrollY > 0) {
            setIsInputVisible(false); // Esconde o Input quando rola para baixo e não está no topo
        }
        setLastScrollY(currentScrollY); // Atualiza a última posição de rolagem
    };


    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredData(data);
        } else {
            const normalizedQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

            const filtered = data.filter((book) =>
                book.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalizedQuery)
            );
            setFilteredData(filtered);
        }
    };

    useEffect(() => {
        const handleBookUpdate = (updatedBook) => {
            updateBookInState(updatedBook);
        };

        eventManager.subscribe("bookUpdated", handleBookUpdate);

        return () => eventManager.unsubscribe("bookUpdated", handleBookUpdate);
    }, []);

    const updateBookInState = (updatedBook) => {
        setFilteredData(currentFilteredData =>
            currentFilteredData.map(book =>
                book.id === updatedBook.id ? updatedBook : book
            )
        );
    };


    return (
        <Box flex={1} flexDirection="column" >
            {isInputVisible && (
                <HStack padding={4} w="100%" alignContent="center" justifyContent="center" safeArea marginBottom="0" marginTop="-5">
                    <Input
                        ref={inputRef}
                        color="#FFF"
                        variant="underlined"
                        placeholder="Pesquisar"
                        width="100%"
                        py="1"
                        px="2"
                        fontSize="14"
                        onChangeText={handleSearch}
                        value={searchQuery}
                        autoCorrect={false}
                        InputLeftElement={
                            <Pressable onPress={() => inputRef.current?.focus()}>
                                <Icon as={<MaterialIcons name="search" />} size="md" mr="-1" color="muted.400" />
                            </Pressable>
                        }/>
                </HStack>
            )}

            <Box paddingX={4}>
                <FlatList
                    data={filteredData}
                    renderItem={({ item }) => <Books data={item} navigation={navigation} onUpdateBook={updateBookInState} />}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </Box>
        </Box>
  );
}