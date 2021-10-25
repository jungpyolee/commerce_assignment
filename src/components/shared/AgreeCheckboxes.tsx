import React from 'react';
import { List, ListItem, Row, Col } from 'framework7-react';
import { useFormikContext } from 'formik';
import { map } from 'lodash';
import { AiOutlineRight } from 'react-icons/ai';
import i18next from 'i18next';

interface AgreeCheckBoxProps {
  names: string[];
}

const AgreeCheckboxes: React.FC<AgreeCheckBoxProps> = ({ names }) => {
  const { values, handleChange, setFieldValue, validateField } = useFormikContext();

  const onClickAgreeAll = () => {
    // console.log(names);
    map(names, (name) => {
      setFieldValue(name, true);
      validateField(name);
    });
  };

  return (
    <>
      <div className="p-4 mt-4 bg-white">
        <div className="mt-5">
          <a onClick={onClickAgreeAll} className="text-red-600 red">
            전체 동의
          </a>
        </div>
      </div>
      <div className="pb-12">
        {map(names, (name, index) => (
          <div key={index}>
            <Row>
              <Col>
                <List noHairlines className="m-0 agree-list">
                  <ListItem
                    checkbox
                    className="text-xs"
                    title={i18next.t('checkdesc')[name]}
                    name={name}
                    onChange={handleChange}
                    value={values[name]}
                    checked={values[name]}
                    borderColor="white"
                  >
                    <div slot="inner">
                      <a className="text-base link" href="#">
                        <AiOutlineRight size="20" color="#D0D0D0" />
                      </a>
                    </div>
                  </ListItem>
                </List>
              </Col>
            </Row>
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(AgreeCheckboxes);
