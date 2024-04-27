import {Text} from 'react-native';
import React, {useEffect} from 'react';
import {Actionsheet, useDisclose} from 'native-base';

const BottomSheet = () => {
  const {isOpen, onClose, onOpen} = useDisclose();

  useEffect(() => {
    onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} disableOverlay>
      <Actionsheet.Content>
        <Actionsheet.Item>
          <Text>Option 1</Text>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default BottomSheet;
