import { Stack, Text } from '@fluentui/react'
import { formValues } from './Dashboard';


const UserDetailPanel = ({ usersDetailprop }: formValues | any) => {


    return (
        <div aria-hidden="true">
            <Stack horizontal horizontalAlign='space-between'>
                <Stack>
                    <Text>Name</Text>
                    <Text>Email</Text>
                    <Text>Phone No</Text>
                    <Text>City</Text>
                    <Text>District</Text>
                    <Text>Country</Text>
                </Stack>
                <Stack>
                    <Text>:</Text>
                    <Text>:</Text>
                    <Text>:</Text>
                    <Text>:</Text>
                    <Text>:</Text>
                    <Text>:</Text>
                </Stack>
                <Stack>
                    <Text>{usersDetailprop?.name}</Text>
                    <Text>{usersDetailprop?.email}</Text>
                    <Text>{usersDetailprop?.phoneNo}</Text>
                    <Text>{usersDetailprop?.city}</Text>
                    <Text>{usersDetailprop?.district}</Text>
                    <Text>{usersDetailprop?.country}</Text>
                </Stack>
            </Stack>
        </div >
    )
}

export default UserDetailPanel
