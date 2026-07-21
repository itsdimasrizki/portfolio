import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <>
    <Navbar />

    <main>
      <Section>
        <Container>
          <h1 className="text-5xl font-bold">
            Hello, I'm Your Name
          </h1>

          <p className="mt-4 max-w-xl text-muted-foreground">
            Full Stack Developer crafting modern web experiences.
          </p>
        </Container>
      </Section>
    </main>
    </>
  );
}

// export default function Home() {
//   return <h1>Hello</h1>;
// }