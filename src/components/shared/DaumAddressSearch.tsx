import React, { useState, useRef } from 'react';
import { f7, List, Row, Col, ListInput, ListItem, AccordionItem, AccordionContent } from 'framework7-react';
import DaumPostcode from 'react-daum-postcode';
import { useFormikContext } from 'formik';
import { Address } from '@constants';
import i18next from 'i18next';

interface DaumAddressSearchProps {
  title?: string;
}

const DaumAddressSearch: React.FC<DaumAddressSearchProps> = ({ title = '주소 정보' }) => {
  const {
    values: { zipcode, address1, address2 },
    touched,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
  } = useFormikContext<Address>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const $address2Input = useRef<HTMLInputElement>({} as HTMLInputElement);
  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setFieldValue('zipcode', data.zonecode);
    setFieldValue('address1', fullAddress);
    setIsOpen(false);
    $address2Input.current.focus();
  };

  return (
    <List className="mb-0" noHairlines>
      <ul>
        <li className="p-4 pl-5">배송지</li>
        <Row>
          <Col width="70">
            <ListInput
              type="text"
              name="zipcode"
              placeholder={i18next.t('login.zipcode')}
              onChange={handleChange}
              value={zipcode}
              errorMessageForce
              errorMessage={touched.zipcode && errors.zipcode}
              readonly
              outline
              onFocus={() => setIsOpen(!isOpen)}
              className="pb-4"
            />
          </Col>
          <Col width="30" className="">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="button button-outline w-16 h-8 text-sm mt-4 mr-4"
            >
              주소검색
            </button>
          </Col>
        </Row>
        {isOpen && <DaumPostcode onComplete={handleComplete} />}
        <ListInput
          type="text"
          name="address1"
          placeholder={i18next.t('login.address1')}
          onChange={handleChange}
          value={address1}
          errorMessageForce
          errorMessage={touched.address1 && errors.address1}
          readonly
          outline
          className="pb-4"
        />
        <ListInput
          ref={() => ($address2Input.current = f7.$el.find('input[name=address2]'))}
          type="text"
          name="address2"
          placeholder={i18next.t('login.address2')}
          onChange={handleChange}
          onBlur={handleBlur}
          value={address2}
          clearButton
          outline
          className="pb-4"
        />
      </ul>
    </List>
  );
};

export default React.memo(DaumAddressSearch);
