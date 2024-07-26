import { COLOR_BLUE_3, COLOR_BLUE_1 } from '@/constants/colors';
import styled from 'styled-components';

const Notice = styled.div`
  width: 100%;
  padding: 10px;
  color: gray;
  font-size: 14px;
  border: 1px solid ${COLOR_BLUE_1};
  background: ${COLOR_BLUE_3};
  border-radius: 4px;
`;

export default Notice;
