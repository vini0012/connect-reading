import React, {useState} from "react";
import {Box, Button, Center, Heading, Icon, Modal, Pressable, Text, VStack} from "native-base";
import {MaterialIcons} from "@expo/vector-icons";

export default function Books({ data, navigation }) {

    const RenderTextWithBoldLabel = ({ text }) => {
        const index = text.indexOf(":");
        if (index !== -1) {
            return (
                <Text color="white">
                    <Text bold>{text.substring(0, index + 1)}</Text> {}
                    <Text>{text.substring(index + 1)}</Text> {}
                </Text>
            );
        } else {
            return <Text color="white">{text}</Text>;
        }
    };

    const [showModal, setShowModal] = useState(false);
    const navigateToChapters = () => {
        navigation.navigate('Chapters', { book: data });
    };

    return (
        <Pressable onPress={navigateToChapters} _pressed={{ opacity: 0.5 }}>
            <Box flex={1}
                 flexDirection="column"
                 marginBottom={0}
                 padding={1}
                 borderBottomWidth="1"
                 borderBottomColor="gray.900"
            >

                <Box flexDirection="row" alignItems="center">
                    <Center
                        width={9}
                        height={9}
                        borderRadius={50}
                        bg="gray.500"
                        mr={2}
                    >
                        <Text color="white" bold>
                            {data.acronym}
                        </Text>
                    </Center>

                    <VStack flex={1} justifyContent="center" mr={2}>
                        <Heading size="sm">{data.name}</Heading>
                        <Text bold color="gray.500">{Math.round(data.percentage)}% Concluído</Text>
                    </VStack>

                    <Center>
                        <Button variant="Ghost" onPress={() => setShowModal(true)}
                                size="sm"
                                _text={{ fontSize: 'sm' }}
                                px="3"
                                leftIcon={<Icon as={MaterialIcons} name="info-outline" size="lg" color="blue.400" />}
                        >
                        </Button>
                    </Center>
                </Box>

                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="700px">
                        <Modal.CloseButton />
                        <Box backgroundColor="black" p="4" borderBottomWidth="0.7" borderBottomColor="#E0E0E0">
                            <Text fontSize="lg" color="white" bold numberOfLines={1} ellipsizeMode="tail">
                                Panorama de {data.name}
                            </Text>
                        </Box>
                        <Modal.Body>
                            <VStack space={4}>
                                {data.author && <RenderTextWithBoldLabel text={ data.author } />}
                                {data.purpose && <RenderTextWithBoldLabel text={ data.purpose } />}
                                {data.date && <RenderTextWithBoldLabel text={ data.date } />}
                                {data.public && <RenderTextWithBoldLabel text={ data.public } />}
                                {data.presentation && <RenderTextWithBoldLabel text={ data.presentation } />}
                                {data.emphasis && <RenderTextWithBoldLabel text={ data.emphasis } />}
                                {data.observation && <RenderTextWithBoldLabel text={ data.observation } />}
                            </VStack>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </Box>
        </Pressable>
    );
}