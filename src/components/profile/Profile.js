import React, { useEffect, useState, useRef } from "react";
import "./Profile.css";
import axios from "axios";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
// import { FiMousePointer } from "react-icons/fi";

const Profile = () => {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    axios
      .get("https://randomuser.me/api/?page=1&results=1&seed=abc")
      .then((res) =>
        console.log(res.data.results, setApiData(res.data.results))
      )
      .catch((err) => console.log("error found: " + err));
  }, []);

  //! Main Content start from here --------------------------------
  const ROTATION_RANGE = 15.5;
  const HALF_ROTATION_RANGE = 15.5 / 2;

  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <div className="profile-wrapper">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          transform,
        }}
        className="card"
      >
        {apiData &&
          apiData?.map((i, index) => (
            <div key={index} className="inner-card">
              <motion.img
                className="profile-img"
                src={i.picture.large}
                alt=""
              />
              <div className="right-inner-card">
                <div className="name-div">
                  <h4>{i.name.first}</h4>
                  <h4>{i.name.last}</h4>
                </div>
                <h4>{i.gender}</h4>
                <h4>{i.phone}</h4>
              </div>
            </div>
          ))}
      </motion.div>
    </div>
  );
};

export default Profile;
