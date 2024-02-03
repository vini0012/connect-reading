import { extendTheme } from 'native-base';

const customTheme = extendTheme({
    colors: {
        primary: {
            50: '#e3f2f9',
            900: '#1a202c',
        },
        black: '#000',
        white: '#fff',
    },
    components: {
        Text: {
            baseStyle: (props) => {
                return {
                    color: 'white',
                };
            },
        },
        Box: {
            baseStyle: {
                backgroundColor: 'black',
            },
        },
        Heading: {
            baseStyle: {
                color: 'white',
            },
        },
    },
});

export default customTheme;
