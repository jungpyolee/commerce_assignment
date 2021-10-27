import React, { useRef } from 'react';
import * as Yup from 'yup';
import { API_URL, createPost, updatePost } from '@api';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Button, ListItem, AccordionContent } from 'framework7-react';
import { Order, Post } from '@constants';
import { Router } from 'framework7/types';
import { string } from 'prop-types';
import { useRecoilState } from 'recoil';
import { itemState, priceState } from '@atoms';
import { currency } from '@js/utils';
import { Price } from './price';

const OrderNewSchema = Yup.object().shape({
  receiver_name: Yup.string().required('필수 입력사항입니다.'),
  receiver_phone: Yup.string()
    .required('필수 입력사항입니다.')
    .min(10, '휴대전화 번호를 확인해주세요')
    .max(11, '휴대전화 번호를 확인해주세요'),

  zipcode: Yup.string()
    .required('필수 입력사항입니다.')
    .min(5, '우편번호를 확인해주세요')
    .max(6, '우편번호를 확인해주세요'),

  address1: Yup.string().required('필수 입력사항입니다.'),

  address2: Yup.string().required('필수 입력사항입니다.'),
});

interface OrderFormProps {
  setOrder?: React.Dispatch<React.SetStateAction<Order>>;
  f7router: Router.Router;
}

interface OrderFormValue {
  receiver_name: string;
  receiver_phone: string;
  zipcode: string;
  address1: string;
  address2: string;
}

const OrderForm = ({ setOrder, f7router }: OrderFormProps) => {
  const [items, setItems] = useRecoilState(itemState);
  const [price, setPrice] = useRecoilState(priceState);

  const formikRef = useRef(null);
  const initialValues: OrderFormValue = {
    receiver_name: '',
    receiver_phone: '',
    zipcode: '',
    address1: '',
    address2: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderNewSchema}
      innerRef={formikRef}
      onSubmit={async (values, { setSubmitting }: FormikHelpers<OrderFormValue>) => {
        f7.dialog.preloader('결제 요청중입니다...');
        await setSubmitting(true);
        try {
          // 여기서 api요청
          // const { data } = await createPost(values);
          // if (data) {
          //   setPosts((posts) => [...posts, data]);
          //   f7router.back();
          // }
        } catch (e) {
          throw new Error(e);
        } finally {
          setSubmitting(false);
          f7.dialog.close();
        }
      }}
      validateOnMount
    >
      {({ values, isSubmitting, handleChange, handleBlur, errors, touched, isValid }) => (
        <Form>
          <List inlineLabels accordionList>
            <ListItem accordionItem accordionItemOpened title="받는 분">
              <AccordionContent>
                <ListInput
                  label="이름"
                  type="text"
                  name="receiver_name"
                  placeholder="이름을 입력해주세요"
                  value={values.receiver_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessageForce
                  errorMessage={touched.receiver_name && errors.receiver_name}
                />
                <ListInput
                  label="전화번호"
                  type="number"
                  name="receiver_phone"
                  placeholder="전화번호를 입력해주세요"
                  value={values.receiver_phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessageForce
                  errorMessage={touched.receiver_phone && errors.receiver_phone}
                />
              </AccordionContent>
            </ListItem>
          </List>
          <List inlineLabels accordionList>
            <ListItem accordionItem accordionItemOpened title="배송지">
              <AccordionContent>
                <ListInput
                  label="우편번호"
                  type="number"
                  name="zipcode"
                  placeholder="우편번호"
                  value={values.zipcode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessageForce
                  errorMessage={touched.zipcode && errors.zipcode}
                />
                <ListInput
                  label="주소"
                  type="text"
                  name="address1"
                  placeholder="주소를 입력해주세요"
                  value={values.address1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessageForce
                  errorMessage={touched.address1 && errors.address1}
                />
                <ListInput
                  label="상세주소"
                  type="text"
                  name="address2"
                  placeholder="상세주소를 입력해주세요"
                  value={values.address2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessageForce
                  errorMessage={touched.address2 && errors.address2}
                />
              </AccordionContent>
            </ListItem>
          </List>

          <List mediaList accordionList>
            <ListItem
              accordionItem
              title="주문 상세 정보"
              after={items ? `${items[0].name} 외 ${items?.length - 1}건` : null}
            >
              {items &&
                items.map((item) => {
                  return (
                    <AccordionContent>
                      <ListItem
                        className=""
                        title={item.name}
                        subtitle={`수량: ${item.quantity}`}
                        footer="hi"
                        after={`${currency(item.sale_price * item.quantity)} 원`}
                      >
                        <img className="rounded-xl" slot="media" src={API_URL + item.image_path} width="80" />
                      </ListItem>
                    </AccordionContent>
                  );
                })}
            </ListItem>
          </List>

          <List>
            <ListItem
              radio
              radioIcon="start"
              title="카드 결제"
              value="creditCard"
              name="payment"
              defaultChecked
            ></ListItem>
            <ListItem radio radioIcon="start" title="계좌이체/무통장입금" value="bankAccount" name="payment"></ListItem>
            <ListItem radio radioIcon="start" title="휴대폰 결제" value="phone" name="payment"></ListItem>
            <ListItem radio radioIcon="start" title="카카오페이" value="kakaoPay" name="payment"></ListItem>
          </List>

          <Price />
          <div className="fixed z-50 w-full bottom-0 p-3">
            <Button type="submit" fill large disabled={isSubmitting || !isValid}>
              결제하기
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OrderForm;
