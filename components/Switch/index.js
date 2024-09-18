import { useState } from "react";
import { Switch } from 'react-native-paper';

const OwnSwitch = (props) => {

  const [isToggleOn, setIsToggleOn] = useState(false);

  const handleChange = () => {

    setIsToggleOn(!isToggleOn);

  };

  return (
    <Switch {...props} value={isToggleOn} onValueChange={handleChange} />
  );

};

export default OwnSwitch;