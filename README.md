# Turing Machine Simulator

An interactive web-based Turing Machine Simulator built for the 
Theory of Computation course (Unit 5 — Turing Machines).

## Live Demo
[Click here to open the simulator](https://turing-machine-simulator.vercel.app)

## Features
- 7 pre-built Turing Machines
- Animated tape with read/write head
- Step-by-step and auto-run modes with speed control
- Space-Time diagram — visualises full tape evolution
- ID Chain — formal Instantaneous Description derivation
- Complexity Analysis — plots steps vs input length (n=1 to 9)
- Formal Definition panel — extracts Q, Σ, Γ, δ, q₀, qₐ, qᵣ
- Custom TM Builder — define your own machine live
- Tape scrubber — rewind and replay any step
- 2-Tape machine support

## Machines Included
| Machine | Unit | Description |
|---|---|---|
| Palindrome Checker | Unit 5 | Accepts strings over {a,b} that are palindromes |
| aⁿbⁿ Recogniser | Unit 3+5 | Accepts equal a's and b's — a classic CFL |
| aⁿbⁿcⁿ Recogniser | Unit 5 | NOT a CFL — proves TMs beat PDAs |
| Binary Increment | Unit 5 | Increments a binary number by 1 |
| Unary Multiplier | Unit 5 | Computes A×B in unary representation |
| 4-State Busy Beaver | Unit 5+6 | Demonstrates Halting Problem undecidability |
| 2-Tape Copy Machine | Unit 5 | Copies tape 1 to tape 2 using dual heads |

## Concepts Demonstrated
- Instantaneous Descriptions (ID) and derivation chains
- Multi-tape Turing Machines
- Decidability vs Recognisability
- Church-Turing Thesis
- Time complexity of TM computation
- Halting Problem (via Busy Beaver)

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Deployed on Vercel

## How to Run Locally
npm install
npm run dev

## Course Info
Subject: Theory of Computation
Unit: 5 — Turing Machines
