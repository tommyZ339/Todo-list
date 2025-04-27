import {AlertDialog, Button, Center, CheckIcon, HStack, Stack} from 'native-base';
import Memo from './Memo';
import {useRef, useState} from 'react';

export default function UnfinishedMemo(props) {
	const cancelRef = useRef(null);
	const [showCancel, setShowCancel] = useState(false);
	const id = props.data['id'];
	const langSetting = props.langSetting

	return (
		<Stack>
			<HStack space={2} style={{marginTop: 10}}>
				<Memo key={id} data={props.data} colorSetting={props.colorSetting} langSetting={props.langSetting}
							sub={props.sub}/>
				<Center>
					{
						showCancel ?
							<Button title={'取消'}/> :
							<CheckIcon size={7} onPress={async () => {
								setShowCancel(true);
							}}/>
					}
				</Center>
			</HStack>

			<AlertDialog leastDestructiveRef={cancelRef} isOpen={showCancel} onClose={() => {
				setShowCancel(false);
			}}>
				<AlertDialog.Content>
					<AlertDialog.CloseButton onPress={() => {
						setShowCancel(false);
					}}/>
					<AlertDialog.Header>Okidoki!</AlertDialog.Header>
					<AlertDialog.Body>
						{langSetting ? 'Sure you finished it?' : '你确定完成该项吗？'}
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
							<Button variant='unstyled' colorScheme='coolGray' onPress={() => {
								setShowCancel(false);
							}} ref={cancelRef}>
								{langSetting ? 'Cancel' : '取消'}
							</Button>
							<Button colorScheme='danger' onPress={async () => {
								await props.onComplete(id);
								setShowCancel(false);
							}}>
								{langSetting ? 'Yes' : '确认'}
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Stack>
	);
}
