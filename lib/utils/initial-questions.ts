import { faker } from "@faker-js/faker";

const tagsPool = [
  "react",
  "vue",
  "angular",
  "tailwind",
  "node",
  "django",
  "spring",
  "mongodb",
  "css",
  "html",
  "python",
  "machine-learning",
];

function generateFakeQuestions(count: number = 10) {
  return Array.from({ length: count }, (_, i) => {
    const gender = faker.helpers.arrayElement(["men", "women"]);
    const id = faker.number.int({ min: 1, max: 99 });
    const tagCount = faker.number.int({ min: 2, max: 4 });

    return {
      id: i + 1,
      title: faker.hacker.phrase(),
      code: faker.helpers
        .arrayElements(
          [
            `// Log a message`,
            `console.log("Hello world");`,

            `// React component`,
            `import React from 'react';`,
            `const MyComponent = () => <div>Hello</div>;`,

            `// Python print`,
            `print("Hello from Python")`,

            `// HTML structure`,
            `<div class='container'>${faker.hacker.noun()}</div>`,

            `// Add function`,
            `const add = (a, b) => a + b;`,

            `// Loop through items`,
            `for (let i = 0; i < 10; i++) console.log(i);`,

            `// API call simulation`,
            `fetch('/api/data').then(res => res.json()).then(console.log);`,
          ],
          faker.number.int({ min: 2, max: 5 })
        )
        .join("\n"),

      tags: faker.helpers.arrayElements(tagsPool, tagCount),
      likes: faker.number.int({ min: 0, max: 100 }),
      comments: faker.number.int({ min: 0, max: 60 }),
      views: faker.number.int({ min: 50, max: 1000 }),
      user: {
        name: faker.person.fullName(),
        image: `https://randomuser.me/api/portraits/${gender}/${id}.jpg`,
      },
      timestamp: faker.date.recent({ days: 30 }).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      isFollowing: faker.datatype.boolean(),
      commentList: [],
    };
  });
}

export const initialQuestions = generateFakeQuestions(100);
