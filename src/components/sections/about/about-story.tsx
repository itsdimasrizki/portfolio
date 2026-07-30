import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";

export function AboutStory() {
  return (
    <Section>
      <Container>
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            My Story
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Building software with purpose, not just features.
          </h2>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              I don't believe software should exist simply because it can be built. Every project I take on starts with one question: What problem does this actually solve?
            </p>

            <p>
              That mindset has shaped the way I learn and build. From web development and backend systems to IoT and machine learning, I enjoy turning ideas into practical solutions that people can actually use. One of the projects I'm most proud of is a smart agriculture system that combines embedded hardware, real-time communication, and software engineering to automate fertigation processes.
            </p>

            <p>
              Outside the classroom, I've had the opportunity to mentor students as a Laboratory Assistant and Teaching Assistant while also serving in student organizations. Those experiences taught me that writing code is only one part of engineering. Communicating ideas, collaborating with others, and leading a team are equally important.
            </p>
            
            <p>
              I'm still early in my journey, and there's a lot left to learn. But every project, every challenge, and every bug I solve reinforces why I chose this path. I aim to become a software engineer who builds technology that is reliable, scalable, and designed with purpose.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}