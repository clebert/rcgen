export class TextLineSet {
  private readonly textLines = new Set<string>();

  public addTextLine(textLine: string): this {
    const trimmedTextLine = textLine.trim();

    if (trimmedTextLine) {
      this.textLines.add(trimmedTextLine);
    }

    return this;
  }

  public getTextLines(): string[] {
    return Array.from(this.textLines).sort();
  }
}
