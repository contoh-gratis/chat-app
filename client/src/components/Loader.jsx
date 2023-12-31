import PropTypes from 'prop-types';
import './Loader.css';

const Loader = ({ text }) => {
  return (
    <div class='tetrominos'>
      <div class='tetromino box1'></div>
      <div class='tetromino box2'></div>
      <div class='tetromino box3'></div>
      <div class='tetromino box4'></div>
    </div>
  );
}

Loader.propTypes = {
  text: PropTypes.any,
};

Loader.defaultProps = {
  text: 'Loading',
};

export default Loader;