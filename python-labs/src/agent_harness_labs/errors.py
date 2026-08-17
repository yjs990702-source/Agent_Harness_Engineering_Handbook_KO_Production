"""Stable failure codes shared by the Python labs."""


class ContractError(ValueError):
    """A boundary failure with a stable, language-neutral code."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(f"[{code}] {message}")
        self.code = code
