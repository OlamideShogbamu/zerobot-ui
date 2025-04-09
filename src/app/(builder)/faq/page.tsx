import FaqBotForm from "@/components/FaqForm"

const FaqPage = () => {
    return (
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
          <div className='w-full lg:w-2/3 flex flex-col gap-8'>
              <div className="">
                <FaqBotForm />
              </div>
          </div>
  
      {/* RIGHT */}
          <div className='w-full lg:w-1/3 flex flex-col gap-8'>
              r
          </div>
      </div>
    )
  }
  
  export default FaqPage