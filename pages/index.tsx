import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [answer, setAnswer] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const lastAnswer = localStorage.getItem("answer");

      if (lastAnswer) {
        setAnswer(lastAnswer.split(","));
      } else {
        setAnswer([]);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    localStorage.removeItem("answer");
    localStorage.setItem("currentQuestion", String(0));
    localStorage.setItem(
      "endTime",
      String(new Date().getTime() + 10 * 60 * 1000),
    );

    router.push("/questions");
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center gap-12 p-24 ${inter.className} bg-gradient-to-t from-pink-500/50 to-purple-500/50`}
    >
      <Button onClick={handleSubmit} className="text-lg font-bold">
        Start Questionnaire
      </Button>
      <div className="space-y-1 font-semibold text-white">
        <div>Last Answer : </div>
        {answer.length > 0 &&
          answer.map((el: string, index: number) => {
            return <div key={index}>{`${index + 1}. ${el}`}</div>;
          })}
      </div>
    </main>
  );
}
