import AsyncStorage from "@react-native-async-storage/async-storage";
import {getCache, setCache} from "./cache";

const useStorage = () => {



    const getItem = async (key, id) => {
        let items = getCache(key); // Tenta obter os dados do cache
        if (!items) {
            // Se não estiver no cache, busca do AsyncStorage
            const data = await AsyncStorage.getItem(key);
            items = JSON.parse(data) || [];
            setCache(key, items); // Atualiza o cache
        }
        return items.find(item => item.id === id) || null;
    };

    const getAllItems = async (key) => {
        try {
            let items = getCache(key);
            if (!items) {
                // Se não estiver no cache, busca do AsyncStorage
                const data = await AsyncStorage.getItem(key);
                items = JSON.parse(data) || [];
                setCache(key, items); // Atualiza o cache
            }
            return items;
        } catch (error) {
            console.error("Erro ao buscar todos os itens", error);
            return [];
        }
    };

    const saveItem = async (key, newValue) => {
        try {
            let items = await getAllItems(key); // Esta chamada já verifica o cache
            const itemIndex = items.findIndex(item => item.id === newValue.id);

            if (itemIndex !== -1) {
                items[itemIndex] = newValue;
            } else {
                items.push(newValue);
            }

            // Atualiza o AsyncStorage e o cache
            await AsyncStorage.setItem(key, JSON.stringify(items));
            setCache(key, items); // Atualiza o cache

            console.log("Item salvo ou atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar ou atualizar o item", error);
        }
    };

    const removeItem = async (key, idToRemove) => {
        try {
            let items = await getAllItems(key); // Esta chamada já verifica o cache
            let updatedItems = items.filter(item => item.id !== idToRemove);

            // Atualiza o AsyncStorage e o cache
            await AsyncStorage.setItem(key, JSON.stringify(updatedItems));
            setCache(key, updatedItems); // Atualiza o cache

        } catch (error) {
            console.error("Erro ao deletar", error);
        }
    }

    return {
        getItem,
        saveItem,
        removeItem,
        getAllItems,
    }

}

export default useStorage;