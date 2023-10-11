import { Image, Modal } from "antd";
import React from "react";

const ImageModal = (props) => {
  const { visible, onClose, data } = props;
  return (
    <Modal
      title="Freeze Photo"
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      footer={null}
    >
      {data &&
        data?.image?.map((image, i) => {
          return <Image key={i} preview={false} width={200} src={image} />;
        })}
    </Modal>
  );
};

export default ImageModal;
