import json
import os

base_dir = r"c:\Users\Eumelle\Desktop\GitHub Projects\quiz-bot\quiz_files"

files = [
    "compiled_new_batch.json",
    "compiled_matching.json",
    "compiled_new_batch_2.json"
]

all_questions = []
title = ""
description = ""

for f in files:
    with open(os.path.join(base_dir, f), "r", encoding="utf-8") as infile:
        data = json.load(infile)
        # Use the updated title and description from compiled_matching.json
        if f == "compiled_matching.json":
            title = data.get("title", "")
            description = data.get("description", "")
        
        all_questions.extend(data.get("questions", []))

# Ensure questions are arranged numerically by id
all_questions.sort(key=lambda x: x.get("id", 0))

output_data = {
    "title": title,
    "description": description,
    "questions": all_questions
}

output_path = os.path.join(base_dir, "overall_compiled.json")
with open(output_path, "w", encoding="utf-8") as outfile:
    json.dump(output_data, outfile, indent=2, ensure_ascii=False)

print(f"Successfully merged {len(all_questions)} questions into {output_path}")
