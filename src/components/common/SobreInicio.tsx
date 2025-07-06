export function SobreInicio() {
  return (
    <>
      <div className='flex flex-col items-center gap-2'>
        <img src='/logosnack.png' alt='logosnack' width={200} height={200} />
      </div>
      <div className='pt-24 text-center space-y-2'>
        <h3 className='text-3xl font-bold text-[#e53935]'>
          Bem-vindo ao Snack!
        </h3>
        <p className='text-lg font-bold text-neutral-600'>
          Escolha como prefere ser atendido:
        </p>
      </div>
    </>
  );
}
