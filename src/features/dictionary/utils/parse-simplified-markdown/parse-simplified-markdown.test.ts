import { describe, it, expect } from 'vitest';
import { parseSimplifiedMarkdown } from './parse-simplified-markdown';

describe('parseSimplifiedMarkdown', () => {
    describe('empty and plain text', () => {
        it('should return empty array for empty string', () => {
            const result = parseSimplifiedMarkdown('');
            expect(result).toEqual([]);
        });

        it('should return single plain text segment for text without bold markers', () => {
            const result = parseSimplifiedMarkdown('Hello world');
            expect(result).toEqual([
                { text: 'Hello world', bold: false },
            ]);
        });

        it('should handle text with single asterisks (not bold)', () => {
            const result = parseSimplifiedMarkdown('This is *not* bold');
            expect(result).toEqual([
                { text: 'This is *not* bold', bold: false },
            ]);
        });
    });

    describe('single bold segment', () => {
        it('should parse single bold segment in the middle of text', () => {
            const result = parseSimplifiedMarkdown('This is **bold** text');
            expect(result).toEqual([
                { text: 'This is ', bold: false },
                { text: 'bold', bold: true },
                { text: ' text', bold: false },
            ]);
        });

        it('should parse bold segment at the start of text', () => {
            const result = parseSimplifiedMarkdown('**Bold** at start');
            expect(result).toEqual([
                { text: 'Bold', bold: true },
                { text: ' at start', bold: false },
            ]);
        });

        it('should parse bold segment at the end of text', () => {
            const result = parseSimplifiedMarkdown('End with **bold**');
            expect(result).toEqual([
                { text: 'End with ', bold: false },
                { text: 'bold', bold: true },
            ]);
        });

        it('should parse text with only bold segment', () => {
            const result = parseSimplifiedMarkdown('**bold**');
            expect(result).toEqual([
                { text: 'bold', bold: true },
            ]);
        });
    });

    describe('multiple bold segments', () => {
        it('should parse multiple bold segments', () => {
            const result = parseSimplifiedMarkdown('**First** and **second** bold');
            expect(result).toEqual([
                { text: 'First', bold: true },
                { text: ' and ', bold: false },
                { text: 'second', bold: true },
                { text: ' bold', bold: false },
            ]);
        });

        it('should parse consecutive bold segments', () => {
            const result = parseSimplifiedMarkdown('**First****Second**');
            expect(result).toEqual([
                { text: 'First', bold: true },
                { text: 'Second', bold: true },
            ]);
        });

        it('should parse multiple bold segments with plain text', () => {
            const result = parseSimplifiedMarkdown('Start **bold1** middle **bold2** end');
            expect(result).toEqual([
                { text: 'Start ', bold: false },
                { text: 'bold1', bold: true },
                { text: ' middle ', bold: false },
                { text: 'bold2', bold: true },
                { text: ' end', bold: false },
            ]);
        });
    });

    describe('edge cases', () => {
        it('should not parse empty bold markers', () => {
            const result = parseSimplifiedMarkdown('Text with **** empty');
            expect(result).toEqual([
                { text: 'Text with **** empty', bold: false },
            ]);
        });

        it('should handle bold segment with spaces', () => {
            const result = parseSimplifiedMarkdown('**bold with spaces**');
            expect(result).toEqual([
                { text: 'bold with spaces', bold: true },
            ]);
        });

        it('should handle bold segment with special characters', () => {
            const result = parseSimplifiedMarkdown('**bold!@#$%^&*()**');
            expect(result).toEqual([
                { text: 'bold!@#$%^&*()', bold: true },
            ]);
        });

        it('should handle bold segment with numbers', () => {
            const result = parseSimplifiedMarkdown('**123 bold 456**');
            expect(result).toEqual([
                { text: '123 bold 456', bold: true },
            ]);
        });

        it('should handle text with unclosed bold markers', () => {
            const result = parseSimplifiedMarkdown('Text with **unclosed bold');
            expect(result).toEqual([
                { text: 'Text with **unclosed bold', bold: false },
            ]);
        });

        it('should handle text with only opening markers', () => {
            const result = parseSimplifiedMarkdown('** only opening');
            expect(result).toEqual([
                { text: '** only opening', bold: false },
            ]);
        });
    });

    describe('complex scenarios', () => {
        it('should parse complex text with multiple patterns', () => {
            const result = parseSimplifiedMarkdown(
                'Normal **bold1** text **bold2** and **bold3** end'
            );
            expect(result).toEqual([
                { text: 'Normal ', bold: false },
                { text: 'bold1', bold: true },
                { text: ' text ', bold: false },
                { text: 'bold2', bold: true },
                { text: ' and ', bold: false },
                { text: 'bold3', bold: true },
                { text: ' end', bold: false },
            ]);
        });

        it('should not parse bold markers spanning multiple lines', () => {
            const result = parseSimplifiedMarkdown('**bold\nwith\nnewlines**');
            expect(result).toEqual([
                { text: '**bold\nwith\nnewlines**', bold: false },
            ]);
        });

        it('should handle mixed content with various patterns', () => {
            const result = parseSimplifiedMarkdown(
                'Start **bold** *single* **another** end'
            );
            expect(result).toEqual([
                { text: 'Start ', bold: false },
                { text: 'bold', bold: true },
                { text: ' *single* ', bold: false },
                { text: 'another', bold: true },
                { text: ' end', bold: false },
            ]);
        });
    });
});
