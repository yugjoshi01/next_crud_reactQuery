import Image from "next/image";
import delete_img from "../../public/image/delete.png";

function Delete() {
  return (
    <>
      <Image src={delete_img} alt="edit" height={30} />
    </>
  );
}

export default Delete;
