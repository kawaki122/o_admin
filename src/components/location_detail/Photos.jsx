import { Image } from "antd";

function Photos({ location }) {
  return (
    <Image.PreviewGroup
      preview={{
        onChange: (current, prev) =>
          console.log(`current index: ${current}, prev index: ${prev}`),
      }}
    >
      {location.files.map((file) => (
        <Image
          width={200}
          src={file}
          style={{padding: '5px'}}
        />
      ))}
    </Image.PreviewGroup>
  );
}

export default Photos;
