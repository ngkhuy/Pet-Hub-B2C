export default async function Register() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("On delaying");
    }, 2000);
  });

  return (
    <main>
      <div>Register</div>
    </main>
  );
}
