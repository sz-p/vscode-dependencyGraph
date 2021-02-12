import React, { useState, useRef, useEffect } from 'react';
import styles from "./force-3d.scss";
import showDemoHandle from "./demoHandle/showdemohandle";
import { connect } from 'react-redux';


function Force3D(props) {
  const container = useRef();

  useEffect(() => {
    const demo = new showDemoHandle(container.current, JSON.parse(JSON.stringify(props.data)));
    demo.show();
    return () => {
      demo.end();
    };
  }, [props.data]);
  // const [count, setCount] = useState(0);
  return (
    <div className={styles.page} style={props.style}>
      <div ref={container} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}></div>
    </div>
  );
}
const mapStateToProps = (state) => {
  console.log(state)
  if (state) {
    return {
      data: state.data
    };
  } else {
    return {}
  }
};
export default connect(mapStateToProps)(Force3D);
