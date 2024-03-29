import React, {memo, useEffect, useReducer, useState} from 'react';
import {Box, Checkbox, FlatList, HStack, IconButton, Pressable, Progress, Text, VStack} from 'native-base';
import {MaterialIcons} from "@expo/vector-icons";
import {eventManager} from "../EventManager";
import {useIsFocused} from "@react-navigation/native";
import useStorage from "../hooks/useStorage";
import {getCache, setCache} from "../hooks/cache";

const chaptersPerPage = 15;

const chapterReducer = (state, action) => {
    switch (action.type) {
        case 'toggle_read':
            return state.map((chapter, index) =>
                index === action.index ? { ...chapter, read: !chapter.read } : chapter
            );
        case 'update_chapters':
            return action.chapters;
        default:
            return state;
    }
};

const ChapterItem = memo(({ item, onToggle, isReadOnly }) => {
    // A função handleToggle agora é chamada diretamente pelo Pressable,
    // envolvendo tanto o texto quanto a Checkbox.
    return (
        <Pressable onPress={() => !isReadOnly && onToggle()} flex={1} flexDirection="column">
            <HStack w="100%" justifyContent="space-between" alignItems="center" p="2" borderBottomWidth="1" borderBottomColor="gray.900">
                <Checkbox
                    isChecked={item.read}
                    // A Checkbox agora é um elemento puramente visual sem onChange
                    aria-label={`Capítulo ${item.number} ${item.read ? 'marcado como lido' : 'não lido'}`}
                    accessibilityLabel={`Capítulo ${item.number} ${item.read ? 'marcado como lido' : 'não lido'}`}
                    value="green"
                    colorScheme="green"
                    // Importante: Não permita que a Checkbox altere seu estado visualmente
                    // por interação, isso é agora gerenciado pelo estado do item e o Pressable
                />
                <Text px="2" flex={1}>Capítulo {item.number}</Text>
            </HStack>
        </Pressable>
    );
});


export default function Chapters({ route }) {
    const book = route.params.book;
    const bookId = route.params.book.id;

    // Usando useReducer para inicializar e gerenciar o estado dos capítulos
    const [isDisabled, setIsDisabled] = useState(false);
    const [chapters, dispatch] = useReducer(chapterReducer, book.chapters || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [percentage, setPercentage] = useState(() => calculateInitialPercentage(book.chapters));
    const { saveItem, getItem } = useStorage();
    const focused = useIsFocused();

    useEffect(() => {
        const startIndex = (currentPage - 1) * chaptersPerPage;
        const endIndex = startIndex + chaptersPerPage;

    }, [currentPage, chapters]);

    useEffect(() => {
        const newPercentage = (chapters.filter(chapter => chapter.read).length / chapters.length) * 100;
        setPercentage(newPercentage);
    }, [chapters]);

    useEffect(() => {
        async function loadBook() {
            let cachedBook = getCache(`@book_${bookId}`);

            if (!cachedBook) {
                console.log("Carregando dados do AsyncStorage...");
                const storedBook = await getItem("@books", bookId);

                if (storedBook) {
                    setCache(`@book_${bookId}`, storedBook);
                    cachedBook = storedBook;
                }
            }

            if (cachedBook) {
                dispatch({ type: 'update_chapters', chapters: cachedBook.chapters });
                const updatedPercentage = calculateInitialPercentage(cachedBook.chapters);
                setPercentage(updatedPercentage);
            }
        }

        if (focused) {
            loadBook();
        }
    }, [focused]);

    // Função para lidar com a marcação dos capítulos
    const handleCheck = (indexWithinPage) => {
        if (isDisabled) return;
        setIsDisabled(true);

        const globalIndex = (currentPage - 1) * chaptersPerPage + indexWithinPage;

        const updatedChapters = chapters.map((chapter, index) =>
            index === globalIndex ? { ...chapter, read: !chapter.read } : chapter
        );

        dispatch({ type: 'update_chapters', chapters: updatedChapters });

        const newPercentage = (updatedChapters.filter(chapter => chapter.read).length / updatedChapters.length) * 100;
        const updatedBook = {
            ...book,
            chapters: updatedChapters,
            percentage: newPercentage,
        };

        eventManager.publish("bookUpdated", updatedBook);
        saveBook(updatedBook);
        setCache(`@book_${bookId}`, updatedBook);

        setTimeout(() => {
            setIsDisabled(false);
        }, 300);

    };

    async function saveBook(book) {
        await saveItem("@books", book);
        console.log("Livro salvo com sucesso", book);
    }

    const totalChapters = chapters.length;
    const totalPages = Math.ceil(totalChapters / chaptersPerPage);

    function calculateInitialPercentage(chapters) {
        if (!chapters || chapters.length === 0) return 0;
        const readChapters = chapters.filter(chapter => chapter.read).length;
        return (readChapters / chapters.length) * 100;
    }

    // Calculando os capítulos a serem exibidos com base na página atual diretamente no render
    const chaptersToDisplay = chapters.slice((currentPage - 1) * chaptersPerPage, currentPage * chaptersPerPage);

    const renderPageIndicators = () => {
        let indicators = [];
        for (let i = 1; i <= totalPages; i++) {
            indicators.push(
                <Box key={i} width={2} height={2} borderRadius="full" bg={currentPage === i ? "white" : "gray.700"} mx={1} />
            );
        }
        return indicators;
    };

    return (
        <Box flex={1} flexDirection="column" marginBottom={4} paddingX={4}>

            <VStack space={2} mb={4}>
                <Progress size="sm" colorScheme="green" value={percentage} mx="0" my="3" w="100%" />
                <Text fontSize="sm" my="-3" textAlign="center" bold color="gray.500">{`${percentage.toFixed(0)}% Concluído`}</Text>
            </VStack>

            <FlatList
                data={chaptersToDisplay}
                keyExtractor={(item) => item.number.toString()}
                renderItem={({ item, index }) => (
                    <ChapterItem item={item} onToggle={() => handleCheck(index)} isDisabled={isDisabled} />
                )}
            />

            <HStack justifyContent="space-between" mt="4">
                {currentPage > 1 ? (
                    <IconButton
                        icon={<MaterialIcons name="arrow-back" size={24} color="white" />}
                        onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    />
                ) : (
                    <Box width="11.4%" />
                )}

                {totalPages > 1 && (
                    <HStack justifyContent="center" mt={4}>
                        {renderPageIndicators()}
                    </HStack>
                )}

                {currentPage < totalPages ? (
                    <IconButton
                        icon={<MaterialIcons name="arrow-forward" size={24} color="white" />}
                        onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        _disabled={{ bg: "transparent", _icon: { color: "gray" } }}
                    />
                ) : (
                    <Box width="11.4%" />
                )}
            </HStack>
        </Box>
    );
}
