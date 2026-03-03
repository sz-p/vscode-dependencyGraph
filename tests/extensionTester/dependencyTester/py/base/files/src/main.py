#!/usr/bin/env python3
"""Main entry point for Python dependency test."""

import module1
from module2 import some_function
from . import relative_module

# Standard library imports (should be ignored)
import os
import sys

# Third-party imports (should be ignored for now)
import numpy as np

def main():
    """Main function."""
    print("Hello from index.py")
    module1.hello()
    some_function()
    relative_module.hello_relative()

if __name__ == "__main__":
    main()