import React, {useState} from "react";
import {Box, Button, Center, Heading, Modal, Pressable, Text, VStack} from "native-base";

export default function Books({ data, navigation, onUpdateBook }) {

    const [showModal, setShowModal] = useState(false);
    const navigateToChapters = () => {
        navigation.navigate('Chapters', { book: data });
    };

    return (
        <Pressable onPress={navigateToChapters} _pressed={{ opacity: 0.5 }}>
            <Box flex={1}
                 flexDirection="column"
                 marginBottom={4}
                 padding={2}
                 borderWidth="1"
                 borderColor="#FFF"
            >

                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Heading size="md">{data.name}</Heading>
                    <Text>{Math.round(data.percentage)}%</Text>
                </Box>

                <Center>
                    <Button variant="outline" onPress={() => setShowModal(true)} mt="4">
                        Mais Informações
                    </Button>
                </Center>

                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text>Autor: {data.author}</Text>
                </Box>

                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text>Propósito: {data.purpose}</Text>
                </Box>

                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text>Data: {data.date}</Text>
                </Box>

                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text>Público alvo: {data.public}</Text>
                </Box>

                {
                    data.presentation && (
                        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Text>{data.presentation}</Text>
                        </Box>
                    )
                }

                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text>Ênfase: {data.emphasis}</Text>
                </Box>

                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Informações do Livro</Modal.Header>
                        <Modal.Body>
                            <VStack space={3}>
                                <Text>Nome: {data.name}</Text>
                                <Text>Autor: {data.author}</Text>
                                <Text>Propósito: {data.purpose}</Text>
                                {/* Adicione mais informações conforme necessário */}
                            </VStack>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                    setShowModal(false);
                                }}>
                                    Fechar
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>


            </Box>
        </Pressable>
    );
}