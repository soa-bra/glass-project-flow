// Sequence Service for Auto-Incrementing Numbers
// Simulates database sequences for contract numbers, invoice numbers, etc.

interface SequenceConfig {
  prefix: string;
  format: string;
  currentValue: number;
  padLength: number;
}

class SequenceService {
  private sequences: Map<string, SequenceConfig> = new Map();

  constructor() {
    this.initializeSequences();
  }

  private initializeSequences() {
    // Contract sequence
    this.sequences.set('CNTR', {
      prefix: 'CNT',
      format: 'CNT-{YYYY}-{####}',
      currentValue: 1000,
      padLength: 4
    });

    // Invoice sequence
    this.sequences.set('INV', {
      prefix: 'INV',
      format: 'INV-{YYYY}-{####}',
      currentValue: 2000,
      padLength: 4
    });

    // Project sequence
    this.sequences.set('PRJ', {
      prefix: 'PRJ',
      format: 'PRJ-{YYYY}-{####}',
      currentValue: 3000,
      padLength: 4
    });

    // Proposal sequence
    this.sequences.set('PROP', {
      prefix: 'PROP',
      format: 'PROP-{YYYY}-{####}',
      currentValue: 4000,
      padLength: 4
    });
  }

  async nextVal(sequenceKey: string): Promise<string> {
    const config = this.sequences.get(sequenceKey);
    if (!config) {
      throw new Error(`Sequence ${sequenceKey} not found`);
    }

    // Increment the current value
    config.currentValue++;

    // Generate the formatted string
    const year = new Date().getFullYear();
    const paddedNumber = config.currentValue.toString().padStart(config.padLength, '0');
    
    const formattedNumber = config.format
      .replace('{YYYY}', year.toString())
      .replace('{####}', paddedNumber);

    // Save the updated sequence (in real app, this would be persisted to database)
    this.sequences.set(sequenceKey, config);

    return formattedNumber;
  }

  async getCurrentVal(sequenceKey: string): Promise<number> {
    const config = this.sequences.get(sequenceKey);
    if (!config) {
      throw new Error(`Sequence ${sequenceKey} not found`);
    }
    return config.currentValue;
  }

  async setVal(sequenceKey: string, value: number): Promise<void> {
    const config = this.sequences.get(sequenceKey);
    if (!config) {
      throw new Error(`Sequence ${sequenceKey} not found`);
    }
    config.currentValue = value;
    this.sequences.set(sequenceKey, config);
  }

  async resetSequence(sequenceKey: string): Promise<void> {
    const config = this.sequences.get(sequenceKey);
    if (!config) {
      throw new Error(`Sequence ${sequenceKey} not found`);
    }
    config.currentValue = 0;
    this.sequences.set(sequenceKey, config);
  }

  getAllSequences(): Record<string, SequenceConfig> {
    return Object.fromEntries(this.sequences);
  }
}

// Export singleton instance
export const sequenceService = new SequenceService();

// Convenience function matching the original API
export const nextVal = (sequenceKey: string) => sequenceService.nextVal(sequenceKey);