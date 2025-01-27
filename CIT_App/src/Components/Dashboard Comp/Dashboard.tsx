import * as React from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { DefaultButton, IconButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { DetailsList, DetailsListLayoutMode, IColumn, Spinner, SpinnerSize, Stack, Text } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { TextField } from '@fluentui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import UserDetailPanel from './UserDetailPanel';
import { getUser } from '../../Services/UserServices';

initializeIcons();

//Form Interface...
export interface formValues {
    id?: String,
    isDeleted: boolean,
    name: String,
    email: String,
    phoneNo: number,
    building: String,
    street: String,
    landMark: String,
    city: String,
    district: String,
    pinCode: number,
    state: String,
    country: String,
    discription: String,
    quantity: number,
    price: number,
    GST: String,
    amount: number,
    discount: String,
    amountPaid: number,
    description: String
}

//Initial Form Values...
const initialFormValues: formValues = {
    id: "",
    isDeleted: false,
    name: "",
    email: "",
    phoneNo: 0,
    building: "",
    street: "",
    landMark: "",
    city: "",
    district: "",
    pinCode: 0,
    state: "",
    country: "",
    discription: "",
    quantity: 0,
    price: 0,
    GST: "",
    amount: 0,
    discount: "",
    amountPaid: 0,
    description: ""
}

//Stack styles...
const stackTokens = { childrenGap: 20 };
const btStyle = {
    root: {
        width: 40,
        marginTop: 10
    }
};
const spinnerStyles = { root: { width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' } };

//Form Validations...
const formSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Name is Required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is Required'),
    phoneNo: Yup.number()
        .typeError("That doesn't look like a phone number")
        .positive("A phone number can't start with a minus")
        .integer("A phone number can't include a decimal point")
        .min(10, 'Phone number is too short')
        .required('A phone number is required'),
    building: Yup.string()
        .required('Building is required'),
    street: Yup.string()
        .required('Street is required'),
    landMark: Yup.string()
        .required('Landmark is required'),
    city: Yup.string()
        .required('City is required'),
    district: Yup.string()
        .required('District is required'),
    pinCode: Yup.number()
        .typeError("That doesn't look like a pin code")
        .positive("A pin code can't start with a minus")
        .integer("A pin code can't include a decimal point")
        .required('Pin code is required'),
    state: Yup.string()
        .required('State is required'),
    country: Yup.string()
        .required('Country is required'),
    discription: Yup.string()
        .required('Description is required'),
    quantity: Yup.number()
        .typeError("That doesn't look like a quantity")
        .positive("Quantity can't start with a minus")
        .integer("Quantity can't include a decimal point")
        .required('Quantity is required'),
    price: Yup.number()
        .typeError("That doesn't look like a price")
        .positive("Price can't start with a minus")
        .required('Price is required'),
    GST: Yup.string()
        .required('GST is required'),
    amount: Yup.number()
        .typeError("That doesn't look like an amount")
        .positive("Amount can't start with a minus")
        .required('Amount is required'),
    discount: Yup.string()
        .required('Discount is required'),
    amountPaid: Yup.number()
        .typeError("That doesn't look like an amount paid")
        .positive("Amount paid can't start with a minus")
        .required('Amount paid is required'),
    description: Yup.string()
        .required('Description is required'),
});

const Dashboard = () => {
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const [isUserDetailOpen, { setTrue: openUserDetailPanel, setFalse: dismissUserDetailPanel }] = useBoolean(false);
    const [data, setData] = useState<formValues[]>();
    const [viewUserdata, setviewUserData] = useState<formValues[] | any>();
    const [isLoading, setisLoading] = useState<boolean>(false);

    //Add Api...
    const handleSubmit = async (values: formValues) => {
        const UValues = {
            name: values.name,
            email: values.email,
            phoneNo: values.phoneNo,
            building: values.building,
            street: values.street,
            landMark: values.landMark,
            city: values.city,
            district: values.district,
            pinCode: values.pinCode,
            state: values.state,
            country: values.country,
            discription: values.discription,
            quantity: values.quantity,
            price: values.price,
            GST: values.GST,
            amount: values.amount,
            discount: values.discount,
            amountPaid: values.amountPaid,
            description: values.description
        }
        await axios.post('https://localhost:7031/api/User/CreateUser', UValues).then((response) => {
            if (response.status === 200) {
                console.log("Data Added Successfully");
            }
        })
        console.log(values);
        dismissPanel();
    }

    //Get Function...
    useEffect(() => {
        const getAllUser = async () => {
            setisLoading(true);
            try {
                const getUsers = await getUser();
                setData(getUsers);
                setisLoading(false);
            }
            catch (error) {
                console.log(error);
            }
        };
        getAllUser();
    }, []);

    //SoftDelete Function.....
    const handleSoftDelete = async (id: any) => {
        await axios.post(`https://localhost:7031/api/User/${id}DeleteUser`)
            .then(() => {
                console.log(`User with id ${id} deleted successfully`);
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
            });
    }

    //Recycle Api....
    const recycleDeleteItem = async (id: any) => {
        await axios.post(`https://localhost:7031/api/User/${id}RecycleUser`)
            .then(() => {
                console.log(`User with id ${id} recycled successfully`);
            })
            .catch((error) => {
                console.log('Error recycling user:', error);
            });
    }

    //View Method...
    const handleView = (item: formValues) => {
        console.log(item);
        setviewUserData(item);
        openUserDetailPanel();
    }

    //Detail List....
    const column: IColumn[] = [
        {
            key: 'column1',
            name: 'SNo',
            fieldName: "index",
            minWidth: 30,
            maxWidth: 60,
            isResizable: true,

        },
        {
            key: 'column2',
            name: 'Name',
            fieldName: "name",
            minWidth: 100,
            maxWidth: 200,
            isResizable: true
        },
        {
            key: "column3",
            name: "Email",
            fieldName: "email",
            minWidth: 250,
            maxWidth: 350,
            isResizable: true,
        },
        {
            key: "column4",
            name: "Phone No",
            fieldName: "phoneNo",
            minWidth: 200,
            maxWidth: 300,
            isResizable: true,
        },
        {
            key: "column5",
            name: "Address",
            fieldName: "state",
            minWidth: 200,
            maxWidth: 300,
            isResizable: true,
        },

        {
            key: 'column7',
            name: 'Actions',
            fieldName: "actions",
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: formValues) => (
                <Stack horizontal>
                    <IconButton
                        menuIconProps={{ iconName: 'RedEye' }}
                        onClick={() => { handleView(item); }}
                    />
                    {item.isDeleted === false ?
                        (<Stack horizontal>
                            <IconButton
                                menuIconProps={{ iconName: 'Edit' }}
                            />
                            <IconButton
                                menuIconProps={{ iconName: 'Delete' }}
                                onClick={() => (handleSoftDelete(item.id))}
                            />
                        </Stack>) : (<Stack>
                            <IconButton menuIconProps={{ iconName: 'Refresh' }} onClick={() => (recycleDeleteItem(item.id))} />
                        </Stack>)
                    }
                </Stack>
            )
        },
    ];

    return (
        <Stack>
            {isLoading === true ?
                <Spinner styles={spinnerStyles} size={SpinnerSize.large} /> :
                <Stack>
                    <Stack>
                        <Stack>
                            <PrimaryButton style={{ width: '40px' }} text="Add" onClick={openPanel} />
                        </Stack>
                        <Panel
                            isOpen={isOpen}
                            onDismiss={dismissPanel}
                            headerText='Add Requst'
                            isFooterAtBottom={true}
                            type={PanelType.medium}
                        >
                            <Formik
                                initialValues={initialFormValues}
                                onSubmit={handleSubmit}
                                validationSchema={formSchema}
                            >
                                {({ values, errors, touched, handleChange }) => (
                                    <Form>
                                        <Stack>
                                            <Text variant='smallPlus'>Personal Details</Text>
                                            <Stack tokens={stackTokens}>
                                                <Stack horizontal tokens={stackTokens}>
                                                    <Field
                                                        as={TextField}
                                                        name="name"
                                                        label='Name'
                                                        value={values.name}
                                                        onChange={handleChange}
                                                        errorMessage={touched.name && errors.name ? errors.name : ""} />

                                                    <Field as={TextField}
                                                        name="email" label='Email'
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        errorMessage={touched.email && errors.email ? errors.email : ""} />
                                                    <Field as={TextField}
                                                        name="phoneNo"
                                                        label='Phone No'
                                                        value={values.phoneNo}
                                                        onChange={handleChange}
                                                        errorMessage={touched.phoneNo && errors.phoneNo ? errors.phoneNo : ""} />

                                                </Stack>
                                                <Stack>
                                                    <Text>Address</Text>
                                                    <Stack horizontal tokens={stackTokens}>
                                                        <Field as={TextField}
                                                            name="building"
                                                            label='Building'
                                                            value={values.building}
                                                            onChange={handleChange}
                                                            errorMessage={touched.building && errors.building ? errors.building : ""} />
                                                        <Field as={TextField}
                                                            name="street"
                                                            label='Street'
                                                            value={values.street}
                                                            onChange={handleChange}
                                                            errorMessage={touched.street && errors.street ? errors.street : ""} />
                                                        <Field as={TextField}
                                                            name="landMark"
                                                            label='landMark'
                                                            value={values.landMark}
                                                            onChange={handleChange}
                                                            errorMessage={touched.landMark && errors.landMark ? errors.landMark : ""} />
                                                    </Stack>
                                                    <Stack horizontal tokens={stackTokens}>
                                                        <Field as={TextField}
                                                            name="city"
                                                            label='City'
                                                            v alue={values.city}
                                                            onChange={handleChange}
                                                            errorMessage={touched.city && errors.city ? errors.city : ""} />
                                                        <Field as={TextField}
                                                            name="district"
                                                            label='District'
                                                            value={values.district}
                                                            onChange={handleChange}
                                                            errorMessage={touched.district && errors.district ? errors.district : ""} />
                                                        <Field as={TextField}
                                                            name="pinCode"
                                                            label='Pin Code'
                                                            value={values.pinCode}
                                                            onChange={handleChange}
                                                            errorMessage={touched.pinCode && errors.pinCode ? errors.pinCode : ""} />
                                                    </Stack>
                                                    <Stack horizontal tokens={stackTokens}>
                                                        <Field as={TextField}
                                                            name="state"
                                                            label='State'
                                                            value={values.state}
                                                            onChange={handleChange}
                                                            errorMessage={touched.state && errors.state ? errors.state : ""} />
                                                        <Field as={TextField}
                                                            name="country"
                                                            label='Country'
                                                            value={values.country}
                                                            onChange={handleChange}
                                                            errorMessage={touched.country && errors.country ? errors.country : ""} />
                                                    </Stack>
                                                </Stack>
                                                <Stack>
                                                    <Text>Item Discription</Text>
                                                    <Stack horizontal tokens={stackTokens}>
                                                        <Field as={TextField}
                                                            name="discription"
                                                            label='Discription'
                                                            value={values.discription}
                                                            onChange={handleChange}
                                                            errorMessage={touched.discription && errors.discription ? errors.discription : ""} />
                                                        <Field as={TextField}
                                                            name="quantity"
                                                            label='Quantity'
                                                            value={values.quantity}
                                                            onChange={handleChange}
                                                            errorMessage={touched.quantity && errors.quantity ? errors.quantity : ""} />
                                                        <Field as={TextField}
                                                            name="price"
                                                            label='Price'
                                                            value={values.price}
                                                            onChange={handleChange}
                                                            errorMessage={touched.price && errors.price ? errors.price : ""} />
                                                    </Stack>
                                                    <Stack horizontal tokens={stackTokens}>
                                                        <Field as={TextField}
                                                            name="GST"
                                                            label='GST%'
                                                            value={values.GST}
                                                            onChange={handleChange}
                                                            errorMessage={touched.GST && errors.GST ? errors.GST : ""} />
                                                        <Field as={TextField}
                                                            name="amount"
                                                            disabled label='Amount'
                                                            value={values.amount}
                                                            onChange={handleChange} />
                                                    </Stack>
                                                    <PrimaryButton text='Add' styles={btStyle} />
                                                </Stack>
                                                <Stack>
                                                    <Text>Payment Deatils</Text>
                                                    <Stack horizontal tokens={stackTokens}>
                                                        <Field as={TextField}
                                                            name="discount"
                                                            label='Discount'
                                                            value={values.discount}
                                                            onChange={handleChange}
                                                            errorMessage={touched.discount && errors.discount ? errors.discount : ""} />
                                                        <Field as={TextField}
                                                            name="amountPaid"
                                                            label='Amount Paid'
                                                            value={values.amountPaid}
                                                            onChange={handleChange}
                                                            errorMessage={touched.amountPaid && errors.amountPaid ? errors.amountPaid : ""} />
                                                    </Stack>
                                                    <Field as={TextField}
                                                        name="description"
                                                        label='Description'
                                                        multiline value={values.description}
                                                        onChange={handleChange}
                                                        errorMessage={touched.description && errors.description ? errors.description : ""} />
                                                </Stack>
                                            </Stack>
                                            <Stack horizontal tokens={stackTokens} styles={{ root: { marginTop: '20px' } }}>
                                                <PrimaryButton type='submit' text='Save' />
                                                <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
                                            </Stack>
                                        </Stack>
                                    </Form>
                                )}
                            </Formik>
                        </Panel>
                    </Stack>
                    <Stack>
                        <DetailsList
                            items={(data || []).map((user, index) => ({
                                ...user,
                                index: index + 1,
                            }))}
                            columns={column}
                            setKey="set"
                            layoutMode={DetailsListLayoutMode.justified}
                            checkboxVisibility={2} />
                    </Stack>
                    <Panel
                        isOpen={isUserDetailOpen}
                        onDismiss={dismissUserDetailPanel}
                        headerText='User Details'
                        type={PanelType.medium}

                    >
                        <UserDetailPanel usersDetailprop={viewUserdata} />
                    </Panel>
                </Stack>
            }
        </Stack >
    )
}

export default Dashboard