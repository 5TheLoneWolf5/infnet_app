import { Surface } from "react-native-paper";

const OwnSurface = (props) => {

  return (
    <Surface {...props}>
        {props.children}
    </Surface>

  );

};

export default OwnSurface;