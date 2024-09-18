import { DataTable } from 'react-native-paper';

const OwnTable = (props) => {

  return (
    <DataTable {...props}>
      {props.children}
    </DataTable>
  );

};

export default OwnTable;