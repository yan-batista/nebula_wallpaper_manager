import PlusIcon from "../../components/icons/PlusIcon"
import MinusIcon from "../../components/icons/MinusIcon"
import FileLine from "../../components/FileLine/index";
import ImageDisplay from "../../components/ImageDisplay/ImageDisplay";
import "./style.css"

const ImagesPage = () => {
  return (
    <>
        <div className="files_container">
          <div className="files">
            <FileLine text="file_name" active/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_12345"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="file_name_jashdkjashdkahjsd"/>
            <FileLine text="111"/>
          </div>
          <div className="buttons">
            <MinusIcon />
            <PlusIcon />
          </div>
        </div>
        <div className="images_container">
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
          <ImageDisplay />
        </div>
  </>
  )
}

export default ImagesPage;