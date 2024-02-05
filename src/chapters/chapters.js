import React, {memo, useEffect, useReducer, useState} from 'react';
import {Box, Checkbox, FlatList, HStack, IconButton, Pressable, Progress, Text, VStack} from 'native-base';
import {MaterialIcons} from "@expo/vector-icons";
import {eventManager} from "../EventManager";

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
    const handleToggle = () => {
        if (!isReadOnly) {
            onToggle();
        }
    };

    return (
        <Box flex={1} flexDirection="column">
            <HStack w="100%" justifyContent="space-between" alignItems="center" p="2" borderBottomWidth="1" borderBottomColor="gray.900">
                <Checkbox
                    isChecked={item.read}
                    onChange={handleToggle}
                    aria-label={`Capítulo ${item.number} ${item.read ? 'marcado como lido' : 'não lido'}`}
                    accessibilityLabel={`Capítulo ${item.number} ${item.read ? 'marcado como lido' : 'não lido'}`}
                    value="green"
                    colorScheme="green"
                />
                <Pressable flex={1} onPress={handleToggle}>
                    <Text px="2">Capítulo {item.number}</Text>
                </Pressable>
            </HStack>
        </Box>
    );
});

export default function Chapters({ route }) {
    const book = route.params.book;

    // Usando useReducer para inicializar e gerenciar o estado dos capítulos
    const [isDisabled, setIsDisabled] = useState(false);
    const [chapters, dispatch] = useReducer(chapterReducer, book.chapters || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [percentage, setPercentage] = useState(() => calculateInitialPercentage(book.chapters));

    useEffect(() => {
        const newPercentage = (chapters.filter(chapter => chapter.read).length / chapters.length) * 100;
        setPercentage(newPercentage);
    }, [chapters]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * chaptersPerPage;
        const endIndex = startIndex + chaptersPerPage;

    }, [currentPage, chapters]);

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

        setTimeout(() => {
            setIsDisabled(false);
        }, 300);

    };

    const totalChapters = chapters.length;
    const totalPages = Math.ceil(totalChapters / chaptersPerPage);

    function calculateInitialPercentage(chapters) {
        if (!chapters || chapters.length === 0) return 0;
        return (chapters.filter(chapter => chapter.read).length / chapters.length) * 100;
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
